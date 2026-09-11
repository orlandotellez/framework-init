import { env } from "../../config/env";
import type { Role } from "../../types/auth";
import jwt, { type SignOptions } from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  storeId: string;
  storeName: string;
}

export const generateTokens = (userId: string, email: string, role: Role, storeId: string, storeName: string) => {
  const accessTokenOptions: SignOptions = {
    expiresIn: 900, // 15 minutes in seconds
  };

  const refreshTokenOptions: SignOptions = {
    expiresIn: 604000, // 7 days in seconds
  };

  const accessToken = jwt.sign(
    { userId, email, role, storeId, storeName } as TokenPayload,
    env.JWT_SECRET,
    accessTokenOptions
  );

  const refreshToken = jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET,
    refreshTokenOptions
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export function getRefreshToken(cookies: Record<string, string>, body: any): string {
  const cookieToken = cookies.refreshToken;
  const bodyToken = typeof body?.refreshToken === "string" ? body.refreshToken : undefined;
  return cookieToken || bodyToken || "";
}
