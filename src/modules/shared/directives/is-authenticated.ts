import { GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, MapperKind, getDirective } from "@graphql-tools/utils";
import { ApolloError } from "apollo-server-express";

const DIRECTIVE_NAME = "isAuthenticated";

export const authDirectiveTransformer = (schema: GraphQLSchema) => {
  const typeDirectiveArgumentMaps: Record<string, any> = {};

  mapSchema(schema, {
    [MapperKind.TYPE]: (type) => {
      const directive = getDirective(schema, type, DIRECTIVE_NAME)?.[0];

      // this is always undefined. is this correct?
      console.log("TYPE", directive);

      if (directive) {
        typeDirectiveArgumentMaps[type.name] = directive;
      }

      return undefined;
    },
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const directive =
        getDirective(schema, fieldConfig, DIRECTIVE_NAME)?.[0] ??
        typeDirectiveArgumentMaps[typeName];

      if (directive) {
        const { error } = directive;

        // for Query.userWithError:

        // OBJECT_FIELD { error: true }
        console.log("OBJECT_FIELD", directive);

        // {"type":"User","args":{},"astNode":{"kind":"FieldDefinition","name":{"kind":"Name","value":"userWithError","loc":{"start":86,"end":99}},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User","loc":{"start":101,"end":105}},"loc":{"start":101,"end":105}},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"isAuthenticated","loc":{"start":107,"end":122}},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"error","loc":{"start":123,"end":128}},"value":{"kind":"BooleanValue","value":true,"loc":{"start":130,"end":134}},"loc":{"start":123,"end":134}}],"loc":{"start":106,"end":135}}],"loc":{"start":86,"end":135}}}
        console.log("OBJECT_FIELD_FIELD_CONFIG", JSON.stringify(fieldConfig));

        // undefined
        console.log(
          "OBJECT_FIELD_FIELD_CONFIG_RESOLVE",
          JSON.stringify(fieldConfig.resolve)
        );

        const { resolve = defaultFieldResolver } = fieldConfig;

        // expect this resolve function to called when calling the query
        // but it's never called
        fieldConfig.resolve = (source, args, context, info) => {
          console.log("RESOLVE_IS_AUTHENTICATED");

          if (!context.headers["auth"]) {
            if (error) {
              throw new ApolloError("unauthorized");
            }

            return null;
          }

          return resolve(source, args, context, info);
        };
      }

      return fieldConfig;
    },
  });
};
