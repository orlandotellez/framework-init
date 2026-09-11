import type { NextFunction, Request, Response } from "express"
import { ForbiddenError, UnauthorizedError } from "../../../../core/errors/AppError.ts"
import { verifyAccessToken } from "./token.utils.ts"

export function getAuthResultFromRequest(request: Request) {
  const cookieToken = request.cookies?.access_token
  const authHeader = request.headers.authorization
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined
  const token = cookieToken ?? bearerToken
  if (!token) {
    return null
  }
  try {
    return verifyAccessToken(token)
  } catch {
    return null
  }
}

export function authGuard(request: Request, _response: Response, next: NextFunction) {
  const payload = getAuthResultFromRequest(request)
  if (!payload) {
    next(new UnauthorizedError("Authentication required"))
    return
  }
  request.userId = payload.userId
  request.userEmail = payload.email
  request.userRole = payload.role
  next()
}

export function adminGuard(request: Request, _response: Response, next: NextFunction) {
  if (request.userRole !== "admin") {
    next(new ForbiddenError("Admin access required"))
    return
  }
  next()
}