import { Module } from "~/lib/modules/declarations";
import { authDefinition } from "./auth";
import { fitbitModule } from "./fitbit";
import { fitbitSubsModule } from "./fitbit-subs";
import { ServerHealth } from "./health";
import { ServerLogging } from "./logging";

export const moduleDefinitions: Module[] = [
  ServerHealth,
  authDefinition,
  fitbitSubsModule,
  // // postDefiniton,
  // testDefinition,
  ServerLogging,
  fitbitSubsModule,
  fitbitModule,
];
