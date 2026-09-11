import { test } from "bun:test"
import assert from "node:assert/strict"
import { ConflictError, NotFoundError } from "@/core/errors/AppError"
import { comparePassword } from "@/modules/auth/application/common/crypto.utils"
import { createUserService } from "../../application/users.service"
import type { IUserEntity } from "../../domain/users.entities"

function makeUser(overrides: Partial<IUserEntity> = {}): IUserEntity {
  return {
    id: "u1",
    name: "Admin",
    email: "admin@example.com",
    password_hash: "hashed",
    role_id: "r1",
    role: { id: "r1", name: "admin" },
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    ...overrides,
  }
}

const makeFakeUserRepository = (overrides: Record<string, unknown> = {}) => ({
  findAll: async () => ({ users: [makeUser()], total: 1, page: 1, limit: 50 }),
  findById: async () => null,
  findByEmail: async () => null,
  create: async (data: { name: string; email: string; password_hash: string; role_id: string }) => makeUser({ ...data, id: "u9" }),
  update: async (id: string, data: Partial<IUserEntity> & { role_id?: string }) => makeUser({ id, ...data }),
  softDelete: async () => {},
  ...overrides,
})

test("list returns users without password_hash", async () => {
  const service = createUserService(makeFakeUserRepository())
  const result = await service.list()

  assert.equal(result.total, 1)
  assert.equal(result.users[0]?.email, "admin@example.com")
  assert.equal("password_hash" in result.users[0]!, false)
})

test("create throws ConflictError when the email already exists", async () => {
  const service = createUserService(
    makeFakeUserRepository({
      findByEmail: async () => makeUser(),
    }),
  )
  await assert.rejects(
    () => service.create({ name: "Other", email: "admin@example.com", password: "password123", role_id: "r2" }),
    ConflictError,
  )
})

test("create hashes the password before storing it", async () => {
  let storedHash = ""
  const repository = makeFakeUserRepository({
    create: async (data: { name: string; email: string; password_hash: string; role_id: string }) => {
      storedHash = data.password_hash
      return makeUser({ ...data, id: "u9" })
    },
  })
  const service = createUserService(repository)

  const result = await service.create({ name: "Cashier", email: "cashier@example.com", password: "password123", role_id: "r2" })

  assert.equal(storedHash !== "password123", true)
  assert.equal(await comparePassword("password123", storedHash), true)
  assert.equal(result.id, "u9")
})

test("getById throws NotFoundError when user does not exist", async () => {
  const service = createUserService(makeFakeUserRepository())
  await assert.rejects(() => service.getById("missing"), NotFoundError)
})

test("delete throws NotFoundError when user does not exist", async () => {
  const service = createUserService(makeFakeUserRepository())
  await assert.rejects(() => service.delete("missing"), NotFoundError)
})