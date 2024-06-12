import { KeystoneContext } from "@keystone-6/core/types";
import type { Request, Response } from "express";
import { z } from "zod";
import { AuthedSession, GlobalContext, GlobalTypeInfo } from "../common/types";

import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { Server, Socket } from "socket.io";
import { ServerAccessFunction } from "./services/access/serverAccessConfig";

extendZodWithOpenApi(z);

export type RouteDeclaration<T = any> = (props: {
  context: KeystoneContext<GlobalTypeInfo>;
  inputData: T;
  req: Request;
  res: Response;
}) => Promise<any> | any;

export enum RouteMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  USE = "use",
}

export enum RequestInputType {
  QUERY = "query",
  BODY = "body",
  PARAMS = "params",
  HEADERS = "headers",
  FILES = "files",
  FORMS = "forms",
}

export type ServerOperationArgs = {
  context: GlobalContext;
  session?: AuthedSession;
  operation: RouteMethod;
};

export const NO_INPUT = z.object({});

export const FILE_TYPE = z.object({
  name: z.string(),
  data: z.any(), // Buffer
  size: z.number(),
  encoding: z.string(),
  tempFilePath: z.string(),
  truncated: z.boolean(),
  mimetype: z.string(),
  md5: z.string(),
});

export class RouteDeclarationMetadata<T = any, U = any> {
  method: RouteMethod;
  inputParser: T;
  useJsonParser?: boolean;
  useFileParser?: boolean;
  outputParser?: U;
  accessConfig?: ServerAccessFunction;
  // @ts-expect-error T does not satisfy the constraint 'z.ZodType<any>'.
  function: RouteDeclaration<z.infer<T>>;

  constructor(args: {
    method: RouteMethod;
    accessConfig?: ServerAccessFunction;
    inputParser: T;
    outputParser?: U;
    // @ts-expect-error T does not satisfy the constraint 'z.ZodType<any>'.
    func: RouteDeclaration<z.infer<T>>;
    useJsonParser?: boolean;
    useFileParser?: boolean;
  }) {
    this.method = args.method;
    this.function = args.func;
    this.inputParser = args.inputParser;
    this.accessConfig = args.accessConfig;
    this.outputParser = args.outputParser;
    this.useJsonParser = args.useJsonParser ?? true;
    this.useFileParser = args.useFileParser ?? false;
  }
}

export type SocketFunction = (args: {
  context: GlobalContext;
  socket: Socket;
  server: Server;
  namespaceContext: Record<string, any>;
  args: {
    args1: any;
    args2: any;
    callback: any;
  };
}) => any;

export type RouteDeclarationList = {
  name: string;
  routes: Map<string, RouteDeclarationMetadata>;
};

export type SocketDeclarationList = {
  name: string;
  socket: Map<string, Map<string, SocketFunction>>;
};