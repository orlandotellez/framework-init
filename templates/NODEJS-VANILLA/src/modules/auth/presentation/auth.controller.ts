import type { RequestContext } from "../../../infrastructure/http/types";
import { createAuthService } from "../application/auth.service";
import { AuthRepository } from "../infrastructure/auth.prisma.repository";
import {
  LoginPayloadDtoSchema,
  RegisterPayloadDtoSchema,
  RegisterStoreDtoSchema,
  VerifyEmailDtoSchema,
  ForgotPasswordDtoSchema,
  ResetPasswordDtoSchema,
  ResendVerificationDtoSchema,
  RevokeSessionDtoSchema,
} from "./auth.dto";
import { env } from "../../../config/env";
import { clearAuthCookies, setAuthCookies } from "../../../core/utils/cookie.utils";
import { ConflictError, UnauthorizedError } from "../../../core/errors/AppError";
import { resolveCurrentUserId } from "../../../core/utils/auth.utils";
import { getRefreshToken } from "../../../core/utils/token.utils";

const authService = createAuthService(AuthRepository);

export const authController = {
  register: async (ctx: RequestContext) => {
    const data = RegisterPayloadDtoSchema.parse(ctx.body);

    const storeId = ctx.storeId;
    if (!storeId) throw new UnauthorizedError("Store context required");

    const result = await authService.register(data, storeId);

    if (!ctx.userId) {
      setAuthCookies(ctx.res, result.accessToken, result.refreshToken, env.NODE_ENV === "production");
    }

    return {
      message: result.message,
      user: result.user,
      store: result.store,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  },

  registerStore: async (ctx: RequestContext) => {
    const data = RegisterStoreDtoSchema.parse(ctx.body);
    const result = await authService.registerStore(data);
    setAuthCookies(ctx.res, result.accessToken, result.refreshToken, env.NODE_ENV === "production");

    return {
      message: result.message,
      user: result.user,
      store: result.store,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  },

  login: async (ctx: RequestContext) => {
    const data = LoginPayloadDtoSchema.parse(ctx.body);
    const currentUserId = await resolveCurrentUserId(ctx);
    const result = await authService.login(data);

    if (currentUserId && currentUserId === result.user.id) {
      throw new ConflictError("Already logged in with this user. Please logout first.");
    }

    if (currentUserId && currentUserId !== result.user.id) {
      clearAuthCookies(ctx.res);
    }

    setAuthCookies(ctx.res, result.accessToken, result.refreshToken, env.NODE_ENV === "production");

    return {
      message: result.message,
      user: result.user,
      store: result.store,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  },

  logout: async (ctx: RequestContext) => {
    const refreshToken = getRefreshToken(ctx.cookies, ctx.body);
    if (!refreshToken) throw new UnauthorizedError("Refresh token required");

    const result = await authService.logout(refreshToken);
    clearAuthCookies(ctx.res);

    return result;
  },

  refresh: async (ctx: RequestContext) => {
    const refreshToken = getRefreshToken(ctx.cookies, ctx.body);
    if (!refreshToken) throw new UnauthorizedError("Refresh token required");

    const result = await authService.refresh(refreshToken);
    setAuthCookies(ctx.res, result.accessToken, result.refreshToken, env.NODE_ENV === "production");

    return {
      message: result.message,
      user: result.user,
      store: result.store,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  },

  verifyEmail: async (ctx: RequestContext) => {
    const data = VerifyEmailDtoSchema.parse(ctx.body);
    const result = await authService.verifyEmail(data);
    setAuthCookies(ctx.res, result.accessToken, result.refreshToken, env.NODE_ENV === "production");

    return { message: result.message };
  },

  resendVerification: async (ctx: RequestContext) => {
    const data = ResendVerificationDtoSchema.parse(ctx.body);
    const result = await authService.resendVerification(data.email);
    return { message: result.message };
  },

  forgotPassword: async (ctx: RequestContext) => {
    const currentUserId = await resolveCurrentUserId(ctx);
    if (currentUserId) throw new ConflictError("Please logout before requesting password reset");

    const data = ForgotPasswordDtoSchema.parse(ctx.body);
    const result = await authService.forgotPassword(data);
    return result;
  },

  resetPassword: async (ctx: RequestContext) => {
    const currentUserId = await resolveCurrentUserId(ctx);
    if (currentUserId) throw new ConflictError("Please logout before resetting password");

    const data = ResetPasswordDtoSchema.parse(ctx.body);
    const result = await authService.resetPassword(data);
    clearAuthCookies(ctx.res);
    return result;
  },

  getUserSessions: async (ctx: RequestContext) => {
    const userId = await resolveCurrentUserId(ctx);
    if (!userId) throw new UnauthorizedError("Authentication required");

    const result = await authService.getUserSessions(userId);
    return result;
  },

  revokeSession: async (ctx: RequestContext) => {
    const userId = await resolveCurrentUserId(ctx);
    if (!userId) throw new UnauthorizedError("Authentication required");

    const { sessionId } = RevokeSessionDtoSchema.parse(ctx.params);
    const result = await authService.revokeSession(userId, sessionId);
    return result;
  },
};
