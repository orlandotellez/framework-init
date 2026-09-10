import type { IUserWithRole, ISessionEntity } from "./auth.entities.ts"

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<IUserWithRole | null>
  findUserById(id: string): Promise<IUserWithRole | null>
  createSession(userId: string, refreshToken: string, expiresAt: Date): Promise<ISessionEntity>
  findSessionByToken(refreshToken: string): Promise<ISessionEntity | null>
  deleteSession(refreshToken: string): Promise<void>
}