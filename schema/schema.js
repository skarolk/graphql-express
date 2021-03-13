const graphql = require("graphql");
// const _ = require("lodash");
const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = graphql;

// const users = [
//   { id: "23", firstName: "Bob", lastName: "Ross", age: 80 },
//   { id: "47", firstName: "Steve", lastName: "Ross", age: 54 },
// ];

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then((response) => response.data);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  // arrow function closure necessary to prevent definition issues
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      // don't need args because using parentValue
      // args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((response) => response.data);
      },
    },
  }),
});

// root query tells graphql where to jump into initial piece of data
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      // resolve reaches out and grabs real data => async promise
      resolve(parentValue, args) {
        // return _.find(users, { id: args.id });
        return (
          axios
            .get(`http://localhost:3000/users/${args.id}`)
            // axios nests response in data key which doesn't play nice with graphql
            // unnesting below
            .then((response) => response.data)
        );
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((response) => response.data);
      },
    },
  },
});

// for updating db
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // for adding user
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        company: { type: GraphQLString },
      },
      resolve(parentValue, { firstName, lastName, age }) {
        return axios
          .post(`http://localhost:3000/users`, { firstName, lastName, age })
          .then((response) => response.data);
      },
    },
    deleteUser: {
      // even though you get nothing back, graphql requires a type
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then((response) => response.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation });
