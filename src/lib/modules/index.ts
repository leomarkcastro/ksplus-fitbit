import { KeystoneConfig } from "@keystone-6/core/types";
import type { GraphQLSchema } from "graphql/type/schema";
import { GlobalTypeInfo } from "~/common/context";
import {
  GraphqlMethodDeclarationList,
  GraphqlSchemaInjection,
} from "../graphql/declarations";
import { bootstrapExpress } from "../rest/injector";
import { bootstrapHttp } from "../socket";
import { Module } from "./declarations";

export function injectModules(
  modules: Module[],
  config: KeystoneConfig<GlobalTypeInfo>,
) {
  // inject schema first
  for (const module of modules) {
    for (const schema of module.schema) {
      config.lists = { ...config.lists, ...schema };
    }
  }

  // inject graphql extensions
  const allExtensions = modules.reduce(
    (acc, module) => {
      const graphqlInjections: GraphqlSchemaInjection[] = [];
      for (const extension of module.graphqlExtensions) {
        if (typeof extension === "function") {
          graphqlInjections.push(extension);
        } else {
          const extensionList = extension as GraphqlMethodDeclarationList;
          graphqlInjections.push(extensionList.compile());
        }
      }
      return [...acc, ...graphqlInjections];
    },
    [] as ((schema: GraphQLSchema) => GraphQLSchema)[],
  );

  const existingExtendGraphqlSchema = config.extendGraphqlSchema;

  config.extendGraphqlSchema = (schema: GraphQLSchema) => {
    let _schema = schema;
    const extensionList = allExtensions;

    if (existingExtendGraphqlSchema) {
      _schema = existingExtendGraphqlSchema(_schema);
    }

    extensionList.forEach((extension) => {
      _schema = extension(_schema);
    });

    return _schema;
  };

  // inject rest api
  const allRestExtensions = modules.reduce(
    (acc, module) => [...acc, ...module.restExtensions],
    [] as Module["restExtensions"],
  );

  const allSocketExtensions = modules.reduce(
    (acc, module) => {
      if (!acc) {
        return module.socketExtensions || [];
      }
      if (module.socketExtensions) {
        return [...acc, ...module.socketExtensions];
      }
      return acc;
    },
    [] as Module["socketExtensions"],
  );

  if (!config.server?.extendExpressApp) {
    config.server = {
      ...config.server,
      extendExpressApp: () => {},
      extendHttpServer: () => {},
    };
  }
  config.server.extendExpressApp = (app, context) => {
    bootstrapExpress(
      app,
      context,
      allRestExtensions,
      allSocketExtensions ?? [],
    );
  };

  config.server.extendHttpServer = (server, context) => {
    bootstrapHttp(server, context, allSocketExtensions ?? []);
  };

  return config;
}
