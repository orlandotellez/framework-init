import { Prisma } from "@prisma/client"
import { prisma } from "../../../config/prisma.ts"
import type { IAuthRepository } from "../domain/auth.interface.ts"

const userSelect = {
  id: true,
  name: true,
  email: true,
  password_hash: true,
  role: { select: { id: true, name: true } },
  is_active: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
} as const

export const AuthRepository: IAuthRepository = {
  async findUserByEmail(email) {
    return prisma.user.findFirst({ where: { email }, select: userSelect })
  },

  async findUserById(id) {
    return prisma.user.findFirst({ where: { id }, select: userSelect })
  },

  async createSession(userId, refreshToken, expiresAt) {
    return prisma.session.create({
      data: { user_id: userId, refresh_token: refreshToken, expires_at: expiresAt },
    })
  },

  async findSessionByToken(refreshToken) {
    return prisma.session.findUnique({ where: { refresh_token: refreshToken } })
  },

  async deleteSession(refreshToken) {
    await prisma.session.delete({ where: { refresh_token: refreshToken } })
  },
}