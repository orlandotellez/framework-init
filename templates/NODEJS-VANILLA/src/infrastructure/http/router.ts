import type { RequestContext, Route, Middleware, RouteHandler } from "./types";

type ParamMap = { pattern: RegExp; keys: string[] };

const paramMaps = new Map<string, ParamMap>();

function compilePath(pattern: string): RegExp {
  const keys: string[] = [];
  const regex = pattern.replace(/:([a-zA-Z_]+)/g, (_match, key) => {
    keys.push(key);
    return "([^/]+)";
  });
  paramMaps.set(pattern, { pattern: new RegExp(`^${regex}$`), keys });
  return paramMaps.get(pattern)!.pattern;
}

function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  let map = paramMaps.get(pattern);
  if (!map) {
    const regex = compilePath(pattern);
    map = paramMaps.get(pattern)!;
  }

  const match = map.pattern.exec(pathname);
  if (!match) return null;

  const params: Record<string, string> = {};
  map.keys.forEach((key, i) => {
    params[key] = decodeURIComponent(match[i + 1]);
  });
  return params;
}

export class Router {
  private routes: Route[] = [];

  private addRoute(method: string, path: string, middlewares: Middleware[], handler: RouteHandler) {
    this.routes.push({ method, path, handler, middlewares });
  }

  get(path: string, ...args: [...Middleware[], RouteHandler]) {
    const handler = args.pop() as RouteHandler;
    const middlewares = args as Middleware[];
    this.addRoute("GET", path, middlewares, handler);
  }

  post(path: string, ...args: [...Middleware[], RouteHandler]) {
    const handler = args.pop() as RouteHandler;
    const middlewares = args as Middleware[];
    this.addRoute("POST", path, middlewares, handler);
  }

  put(path: string, ...args: [...Middleware[], RouteHandler]) {
    const handler = args.pop() as RouteHandler;
    const middlewares = args as Middleware[];
    this.addRoute("PUT", path, middlewares, handler);
  }

  delete(path: string, ...args: [...Middleware[], RouteHandler]) {
    const handler = args.pop() as RouteHandler;
    const middlewares = args as Middleware[];
    this.addRoute("DELETE", path, middlewares, handler);
  }

  patch(path: string, ...args: [...Middleware[], RouteHandler]) {
    const handler = args.pop() as RouteHandler;
    const middlewares = args as Middleware[];
    this.addRoute("PATCH", path, middlewares, handler);
  }

  register(prefix: string, subRouter: Router) {
    for (const route of subRouter.routes) {
      // Normalize: combine prefix + route path, strip trailing slashes (except root)
      const fullPath = prefix + route.path;
      const normalizedPath = fullPath.length > 1 ? fullPath.replace(/\/+$/, "") : fullPath;
      this.routes.push({
        ...route,
        path: normalizedPath,
      });
    }
  }

  find(method: string, pathname: string): { route: Route; params: Record<string, string> } | null {
    // Normalize: strip trailing slash (except root "/")
    const normalizedPathname = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

    for (const route of this.routes) {
      if (route.method !== method) continue;
      const params = matchPath(route.path, normalizedPathname);
      if (params !== null) {
        return { route, params };
      }
    }
    return null;
  }
}
