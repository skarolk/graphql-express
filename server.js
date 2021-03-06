const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    // graphiql for development only
    // schema: schema
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("listening");
});
