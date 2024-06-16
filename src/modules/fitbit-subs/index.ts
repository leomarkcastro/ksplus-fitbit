import { Module } from "~/lib/modules/declarations";
import { fitbitsubsRouteDeclaration } from "./api";

export const fitbitSubsModule = new Module({
  schema: [],
  graphqlExtensions: [],
  restExtensions: [fitbitsubsRouteDeclaration],
});
