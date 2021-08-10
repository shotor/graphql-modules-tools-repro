import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createSchema } from "./modules";

const startApolloServer = async () => {
  const schema = createSchema();

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await server.start();
  const app = express();

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  });
};

startApolloServer();
