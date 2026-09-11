import type { Role } from "../../types/auth";
import type { RequestContext } from "../../infrastructure/http/types";
import { env } from "../../config/env";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface AuthResult {
  userId: string | null;
  role: Role | null;
  storeId: string | null;
  storeName: string | null;
}

export const getUserIdFromCookies = (cookies: Record<string, string>): AuthResult => {
  const token = cookies.accessToken || cookies.refreshToken;
  if (!token) return { userId: null, role: null, storeId: null, storeName: null };

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload & { userId?: string; role?: Role; storeId?: string; storeName?: string };
    return {
      userId: decoded.userId ?? null,
      role: decoded.role ?? null,
      storeId: decoded.storeId ?? null,
      storeName: decoded.storeName ?? null,
    };
  } catch {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload & { userId?: string };
      return { userId: decoded.userId ?? null, role: null, storeId: null, storeName: null };
    } catch {
      return { userId: null, role: null, storeId: null, storeName: null };
    }
  }
};

export const getUserIdFromBearerToken = (
  authorization: string | undefined
): AuthResult => {
  if (!authorization) return { userId: null, role: null, storeId: null, storeName: null };

  const parts = authorization.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return { userId: null, role: null, storeId: null, storeName: null };

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload & { userId?: string; role?: Role; storeId?: string; storeName?: string };
    return {
      userId: decoded.userId ?? null,
      role: decoded.role ?? null,
      storeId: decoded.storeId ?? null,
      storeName: decoded.storeName ?? null,
    };
  } catch {
    return { userId: null, role: null, storeId: null, storeName: null };
  }
};

export const resolveCurrentUserId = async (
  ctx: RequestContext
): Promise<string | null> => {
  try {
    if (ctx.userId) return ctx.userId;

    const fromCookies = getUserIdFromCookies(ctx.cookies);
    if (fromCookies.userId) return fromCookies.userId;

    const fromBearer = getUserIdFromBearerToken(ctx.req.headers.authorization);
    return fromBearer.userId;
  } catch {
    return null;
  }
};
