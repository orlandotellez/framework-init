import type { Response } from "express"
import { env } from "../../../../config/env.ts"

const isProduction = env.NODE_ENV === "production"
const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  path: "/",
} as const

export function setAuthCookies(response: Response, accessToken: string, refreshToken: string) {
  response.cookie("access_token", accessToken, { ...baseCookieOptions, maxAge: ACCESS_COOKIE_MAX_AGE })
  response.cookie("refresh_token", refreshToken, { ...baseCookieOptions, maxAge: REFRESH_COOKIE_MAX_AGE })
}

export function clearAuthCookies(response: Response) {
  response.clearCookie("access_token", { ...baseCookieOptions })
  response.clearCookie("refresh_token", { ...baseCookieOptions })
}