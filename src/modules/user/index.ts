import { createModule } from "graphql-modules";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";

const typeDefsArray = loadFilesSync(`${__dirname}/schema/*.graphql`, {
  useRequire: true,
});

const typeDefs = mergeTypeDefs(typeDefsArray, {
  useSchemaDefinition: false,
});

const resolversArray = loadFilesSync(`${__dirname}/resolvers`, {
  extensions: ["ts", "js"],
  useRequire: true,
});

const resolvers = mergeResolvers(resolversArray);

export const UserModule = createModule({
  id: "user",
  typeDefs,
  resolvers,
});
