import type { IncomingMessage, ServerResponse } from "http";
import { Router } from "./router";
import type { RequestContext } from "./types";
import { AppError, InternalServerError } from "../../core/errors/AppError";
import { ZodError } from "zod";
import { logger as pinoLogger } from "../logger";

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const pair of cookieHeader.split(";")) {
    const idx = pair.indexOf("=");
    if (idx === -1) continue;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

function parseQuery(url: string): Record<string, string> {
  const query: Record<string, string> = {};
  const idx = url.indexOf("?");
  if (idx === -1) return query;
  const searchParams = new URLSearchParams(url.slice(idx + 1));
  searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query;
}

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("application/json")) {
      resolve({});
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function setCorsHeaders(res: ServerResponse, origins: string[]) {
  const origin = res.req?.headers?.origin || "";
  if (origins.includes(origin) || origins.includes("*")) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function setSecurityHeaders(res: ServerResponse) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function handleError(res: ServerResponse, error: unknown, logger: (msg: string) => void) {
  if (error instanceof ZodError) {
    const first = error.errors[0];
    sendJson(res, 400, { message: first?.message ?? "Datos inválidos" });
    return;
  }

  if (error instanceof AppError) {
    sendJson(res, error.statusCode, { message: error.message });
    return;
  }

  if (error instanceof Error && error.message === "Invalid JSON body") {
    sendJson(res, 400, { message: "Invalid JSON body" });
    return;
  }

  logger(`Unhandled error: ${error}`);
  sendJson(res, 500, { message: "Error interno del servidor" });
}

export function createApp(router: Router, corsOrigins: string[] = [], logger: (msg: string) => void = (msg) => pinoLogger.info(msg)) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    // Handle CORS preflight
    setCorsHeaders(res, corsOrigins);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    setSecurityHeaders(res);

    const url = req.url || "/";
    const pathname = url.split("?")[0];
    const method = req.method || "GET";

    // Parse body for POST/PUT/PATCH
    let body: any = {};
    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        body = await parseBody(req);
      } catch (error) {
        sendJson(res, 400, { message: "Invalid JSON body" });
        return;
      }
    }

    const result = router.find(method, pathname);

    if (!result) {
      sendJson(res, 404, { message: "Not Found" });
      return;
    }

    const { route, params } = result;

    const ctx: RequestContext = {
      req,
      res,
      params,
      query: parseQuery(url),
      body,
      cookies: parseCookies(req.headers.cookie),
    };

    try {
      for (const middleware of route.middlewares) {
        await middleware(ctx);
      }

      const response = await route.handler(ctx);

      // If handler already wrote to response, don't send again
      if (!res.writableEnded) {
        if (response === undefined || response === null) {
          // Handler already sent response
        } else if (typeof response === "object" && response !== null && "statusCode" in response) {
          // It's a { statusCode, data } tuple
          sendJson(res, (response as any).statusCode, (response as any).data);
        } else {
          sendJson(res, 200, response);
        }
      }
    } catch (error) {
      if (!res.writableEnded) {
        handleError(res, error, logger);
      }
    }
  };
}
