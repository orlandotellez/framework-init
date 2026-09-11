import type { Request, Response } from "express"
import { createAuthService } from "../application/auth.service.ts"
import { AuthRepository } from "../infrastructure/auth.prisma.repository.ts"
import { LoginDtoSchema, RefreshTokenDtoSchema } from "./auth.dto.ts"
import { clearAuthCookies, setAuthCookies } from "../application/common/cookie.utils.ts"

const authService = createAuthService(AuthRepository)

export const authController = {
  async login(request: Request, response: Response) {
    const body = LoginDtoSchema.parse(request.body)
    const result = await authService.login(body.email, body.password)
    setAuthCookies(response, result.accessToken, result.refreshToken)
    return response.status(200).json({ user: result.user })
  },

  async refresh(request: Request, response: Response) {
    const body = RefreshTokenDtoSchema.parse(request.body)
    const result = await authService.refresh(body.refresh_token)
    return response.status(200).json(result)
  },

  async logout(request: Request, response: Response) {
    const refreshToken = request.cookies?.refresh_token
    await authService.logout(refreshToken)
    clearAuthCookies(response)
    return response.status(200).json({ message: "Logged out successfully" })
  },

  async me(request: Request, response: Response) {
    const result = await authService.me(request.userId)
    return response.status(200).json(result)
  },
}