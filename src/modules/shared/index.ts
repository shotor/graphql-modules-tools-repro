import { createModule } from "graphql-modules";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";

const typeDefsArray = loadFilesSync(`${__dirname}/schema/*.graphql`, {
  useRequire: true,
});

const typeDefs = mergeTypeDefs(typeDefsArray, {
  useSchemaDefinition: false,
});

export const SharedModule = createModule({
  id: "shared",
  typeDefs: typeDefs,
});
