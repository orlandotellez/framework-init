import type { ServerResponse } from "http";

export const setCookie = (
  res: ServerResponse,
  name: string,
  value: string,
  options: {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    path?: string;
  } = {}
) => {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);

  const existing = res.getHeader("Set-Cookie");
  const cookies = Array.isArray(existing) ? existing : existing ? [existing as string] : [];
  cookies.push(parts.join("; "));
  res.setHeader("Set-Cookie", cookies);
};

export const setAuthCookies = (
  res: ServerResponse,
  accessToken: string,
  refreshToken: string,
  isProduction: boolean
) => {
  const sameSite = isProduction ? "strict" : "lax";

  setCookie(res, "accessToken", accessToken, {
    path: "/",
    httpOnly: true,
    secure: isProduction,
    sameSite,
    maxAge: 900,
  });

  setCookie(res, "refreshToken", refreshToken, {
    path: "/",
    httpOnly: true,
    secure: isProduction,
    sameSite,
    maxAge: 604800,
  });
};

export const clearAuthCookies = (res: ServerResponse) => {
  setCookie(res, "accessToken", "", { maxAge: 0, path: "/" });
  setCookie(res, "refreshToken", "", { maxAge: 0, path: "/" });
};
