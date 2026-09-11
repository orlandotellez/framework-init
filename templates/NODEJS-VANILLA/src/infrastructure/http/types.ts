import type { IncomingMessage, ServerResponse } from "http";

export interface RequestContext {
  req: IncomingMessage;
  res: ServerResponse;
  params: Record<string, string>;
  query: Record<string, string>;
  body: any;
  userId?: string;
  userRole?: string;
  storeId?: string;
  storeName?: string;
  cookies: Record<string, string>;
}

export type Middleware = (ctx: RequestContext) => Promise<void> | void;
export type RouteHandler = (ctx: RequestContext) => Promise<any> | any;

export interface Route {
  method: string;
  path: string;
  handler: RouteHandler;
  middlewares: Middleware[];
}
