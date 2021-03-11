const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    // graphiql for development only
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("listening");
});
