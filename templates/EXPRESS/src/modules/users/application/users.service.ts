import { ConflictError, NotFoundError } from "../../../core/errors/AppError.ts"
import { hashPassword } from "../../auth/application/common/crypto.utils.ts"
import type { UpdateUserData } from "../domain/users.entities.ts"
import type { IUserListResponse, IUserResponse } from "../domain/users.types.ts"
import type { IUserRepository } from "../domain/users.interface.ts"
import { mapUserToResponse } from "./common/users.mappers.ts"

export const createUserService = (repository: IUserRepository) => ({
  async list(params?: { search?: string; page?: number; limit?: number }): Promise<IUserListResponse> {
    const result = await repository.findAll(params)
    return {
      users: result.users.map(mapUserToResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
    }
  },

  async getById(id: string): Promise<IUserResponse> {
    const user = await repository.findById(id)
    if (!user) {
      throw new NotFoundError("User not found")
    }
    return mapUserToResponse(user)
  },

  async create(data: { name: string; email: string; password: string; role_id: string }): Promise<IUserResponse> {
    const existing = await repository.findByEmail(data.email)
    if (existing) {
      throw new ConflictError("Email already registered")
    }
    const password_hash = await hashPassword(data.password)
    const user = await repository.create({
      name: data.name,
      email: data.email,
      password_hash,
      role_id: data.role_id,
    })
    return mapUserToResponse(user)
  },

  async update(id: string, data: UpdateUserData): Promise<IUserResponse> {
    const existing = await repository.findById(id)
    if (!existing) {
      throw new NotFoundError("User not found")
    }
    const user = await repository.update(id, data)
    return mapUserToResponse(user)
  },

  async delete(id: string): Promise<void> {
    const existing = await repository.findById(id)
    if (!existing) {
      throw new NotFoundError("User not found")
    }
    await repository.softDelete(id)
  },
})