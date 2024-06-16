import { Module } from "~/lib/modules/declarations";
import { fitbitRouteDeclaration } from "./api";
import { fitbitGQLDeclaration } from "./graphql";

export const fitbitModule = new Module({
  schema: [],
  graphqlExtensions: [fitbitGQLDeclaration],
  restExtensions: [fitbitRouteDeclaration],
});
