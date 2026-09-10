import { UnauthorizedError } from "../../../core/errors/AppError.ts"
import type { IAuthRepository } from "../domain/auth.interface.ts"
import { comparePassword } from "./common/crypto.utils.ts"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./common/token.utils.ts"

const REFRESH_TOKEN_DURATION_MS = 7 * 24 * 60 * 60 * 1000

export const createAuthService = (repository: IAuthRepository) => ({
  async login(email: string, password: string) {
    const user = await repository.findUserByEmail(email)
    if (!user || user.deleted_at || !user.is_active) {
      throw new UnauthorizedError("Invalid credentials")
    }

    const passwordMatch = await comparePassword(password, user.password_hash)
    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid credentials")
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role.name })
    const refreshToken = generateRefreshToken({ userId: user.id })
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DURATION_MS)
    await repository.createSession(user.id, refreshToken, expiresAt)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    }
  },

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token is required")
    }

    let payload
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      throw new UnauthorizedError("Invalid or expired refresh token")
    }

    const session = await repository.findSessionByToken(refreshToken)
    if (!session || session.expires_at < new Date()) {
      throw new UnauthorizedError("Invalid or expired refresh token")
    }

    const user = await repository.findUserById(payload.userId)
    if (!user || user.deleted_at || !user.is_active) {
      throw new UnauthorizedError("User not found")
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role.name })
    return { accessToken }
  },

  async logout(refreshToken?: string) {
    if (refreshToken) {
      await repository.deleteSession(refreshToken)
    }
  },

  async me(userId: string) {
    const user = await repository.findUserById(userId)
    if (!user || user.deleted_at) {
      throw new UnauthorizedError("User not found")
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    }
  },
})