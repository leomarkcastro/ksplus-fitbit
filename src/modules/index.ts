import { Module } from "~/lib/modules/declarations";
import { authDefinition } from "./auth";
import { fitbitSubsModule } from "./fitbit-subs";
import { ServerHealth } from "./health";
import { ServerLogging } from "./logging";
import { testDefinition } from "./test";

export const moduleDefinitions: Module[] = [
  ServerHealth,
  authDefinition,
  fitbitSubsModule,
  // postDefiniton,
  testDefinition,
  ServerLogging,
  fitbitSubsModule,
];
