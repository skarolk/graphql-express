const graphql = require("graphql");
// const _ = require("lodash");
const axios = require("axios");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const users = [
  { id: "23", firstName: "Bob", lastName: "Ross", age: 80 },
  { id: "47", firstName: "Steve", lastName: "Ross", age: 54 },
];

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
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
  },
});

module.exports = new GraphQLSchema({ query: RootQuery });
