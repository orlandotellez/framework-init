import type { RequestContext } from "../../infrastructure/http/types";
import type { Role } from "../../types/auth";
import { UnauthorizedError, ForbiddenError } from "../errors/AppError";
import { getUserIdFromCookies, getUserIdFromBearerToken } from "../utils/auth.utils";

export const authGuard = async (ctx: RequestContext): Promise<void> => {
  const fromCookies = getUserIdFromCookies(ctx.cookies);
  const fromBearer = getUserIdFromBearerToken(ctx.req.headers.authorization);

  const { userId, role, storeId, storeName } = fromCookies.userId ? fromCookies : fromBearer;

  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  ctx.userId = userId;
  ctx.userRole = role ?? undefined;
  ctx.storeId = storeId ?? undefined;
  ctx.storeName = storeName ?? undefined;
};

export const adminGuard = async (ctx: RequestContext): Promise<void> => {
  if (ctx.userRole !== "admin") {
    throw new ForbiddenError("Admin access required");
  }
};
