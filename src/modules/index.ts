import "graphql-import-node";
import { createApplication } from "graphql-modules";
import { SharedModule } from "./shared";
import { authDirectiveTransformer } from "./shared/directives/is-authenticated";
import { UserModule } from "./user";

export const AppModule = createApplication({
  modules: [SharedModule, UserModule],
});

export const createSchema = () => {
  const schema = AppModule.createSchemaForApollo();

  authDirectiveTransformer(schema);

  return schema;
};
