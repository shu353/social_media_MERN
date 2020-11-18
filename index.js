const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config.js");
const typeDefs = require("./graphql/typesDefs");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("db connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`server running at ${res.url}`);
  });
