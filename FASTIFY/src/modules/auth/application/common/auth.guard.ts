import type { FastifyReply, FastifyRequest } from "fastify"
import { UnauthorizedError, ForbiddenError } from "@/core/errors/AppError"
import { verifyAccessToken } from "./token.utils"

export function getAuthResultFromRequest(request: FastifyRequest) {
  const cookieToken = request.cookies.access_token
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

export async function authGuard(request: FastifyRequest, _reply: FastifyReply) {
  const payload = getAuthResultFromRequest(request)
  if (!payload) {
    throw new UnauthorizedError("Authentication required")
  }
  request.userId = payload.userId
  request.userEmail = payload.email
  request.userRole = payload.role
}

export async function adminGuard(request: FastifyRequest, _reply: FastifyReply) {
  if (request.userRole !== "admin") {
    throw new ForbiddenError("Admin access required")
  }
}