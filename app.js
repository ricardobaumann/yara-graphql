const {ApolloServer} = require("apollo-server-express");

const fs = require("fs");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

const gqlFiles = fs.readdirSync(path.join(__dirname, "./graphql/typedefs"));

let typeDefs = "";

gqlFiles.forEach((file) => {
  typeDefs += fs.readFileSync(
      path.join(__dirname, "./graphql/typedefs", file),
      {
        encoding: "utf-8"
      }
  );
});

const resolvers = require("./graphql/resolvers/index");

let apolloServer = {
  graphqlPath: ""
};

async function startServer() {
  const app = express();
  apolloServer = new ApolloServer({typeDefs, resolvers});
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.use((req, res) => {
    res.status(200);
    res.send('Hello!');
    res.end();
  });
  await new Promise(resolve => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
  return { apolloServer, app };
}

startServer();
