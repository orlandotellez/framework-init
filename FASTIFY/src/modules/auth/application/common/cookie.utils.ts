import type { FastifyReply } from "fastify"
import { env } from "@/config/env"

const isProduction = env.NODE_ENV === "production"
const ACCESS_COOKIE_MAX_AGE = 15 * 60
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  path: "/",
} as const

export function setAuthCookies(reply: FastifyReply, accessToken: string, refreshToken: string) {
  reply.setCookie("access_token", accessToken, { ...baseCookieOptions, maxAge: ACCESS_COOKIE_MAX_AGE })
  reply.setCookie("refresh_token", refreshToken, { ...baseCookieOptions, maxAge: REFRESH_COOKIE_MAX_AGE })
}

export function clearAuthCookies(reply: FastifyReply) {
  reply.clearCookie("access_token", { ...baseCookieOptions })
  reply.clearCookie("refresh_token", { ...baseCookieOptions })
}