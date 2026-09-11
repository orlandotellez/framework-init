import { test } from "bun:test"
import assert from "node:assert/strict"
import { UnauthorizedError } from "../../../../core/errors/AppError.ts"
import { createAuthService } from "../../application/auth.service.ts"
import { hashPassword } from "../../application/common/crypto.utils.ts"
import { generateRefreshToken } from "../../application/common/token.utils.ts"

const makeFakeAuthRepository = (overrides: Record<string, unknown> = {}) => ({
  findUserByEmail: async () => null,
  findUserById: async () => null,
  createSession: async () => ({ id: "s1", user_id: "u1", refresh_token: "refresh-token", expires_at: new Date(), created_at: new Date() }),
  findSessionByToken: async () => null,
  deleteSession: async () => {},
  ...overrides,
})

function makeUser(passwordHash: string) {
  return {
    id: "u1",
    name: "Admin",
    email: "admin@example.com",
    password_hash: passwordHash,
    role: { id: "r1", name: "admin" },
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  }
}

test("login returns tokens and user when credentials are valid", async () => {
  const hashed = await hashPassword("password123")
  let sessionCreated = false
  const repository = makeFakeAuthRepository({
    findUserByEmail: async () => makeUser(hashed),
    createSession: async () => {
      sessionCreated = true
      return { id: "s1", user_id: "u1", refresh_token: "refresh-token", expires_at: new Date(), created_at: new Date() }
    },
  })
  const service = createAuthService(repository)

  const result = await service.login("admin@example.com", "password123")

  assert.ok(result.accessToken)
  assert.ok(result.refreshToken)
  assert.equal(result.user.email, "admin@example.com")
  assert.equal(result.user.role, "admin")
  assert.equal(sessionCreated, true)
})

test("login throws UnauthorizedError when password is wrong", async () => {
  const hashed = await hashPassword("password123")
  const repository = makeFakeAuthRepository({
    findUserByEmail: async () => makeUser(hashed),
  })
  const service = createAuthService(repository)

  await assert.rejects(
    () => service.login("admin@example.com", "wrong-password"),
    UnauthorizedError,
  )
})

test("login throws UnauthorizedError when user does not exist", async () => {
  const service = createAuthService(makeFakeAuthRepository())

  await assert.rejects(
    () => service.login("nobody@example.com", "password123"),
    UnauthorizedError,
  )
})

test("refresh returns a new access token for a valid session", async () => {
  const hashed = await hashPassword("password123")
  const refreshToken = generateRefreshToken({ userId: "u1" })
  const repository = makeFakeAuthRepository({
    findSessionByToken: async () => ({ id: "s1", user_id: "u1", refresh_token: refreshToken, expires_at: new Date(Date.now() + 1000 * 60 * 60), created_at: new Date() }),
    findUserById: async () => makeUser(hashed),
  })
  const service = createAuthService(repository)

  const result = await service.refresh(refreshToken)

  assert.ok(result.accessToken)
})

test("refresh throws UnauthorizedError when the session is expired", async () => {
  const refreshToken = generateRefreshToken({ userId: "u1" })
  const repository = makeFakeAuthRepository({
    findSessionByToken: async () => ({ id: "s1", user_id: "u1", refresh_token: refreshToken, expires_at: new Date(Date.now() - 1000 * 60 * 60), created_at: new Date() }),
    findUserById: async () => null,
  })
  const service = createAuthService(repository)

  await assert.rejects(() => service.refresh(refreshToken), UnauthorizedError)
})

test("logout deletes the session", async () => {
  let deleted = false
  const repository = makeFakeAuthRepository({
    deleteSession: async () => {
      deleted = true
    },
  })
  const service = createAuthService(repository)

  await service.logout("refresh-token")

  assert.equal(deleted, true)
})