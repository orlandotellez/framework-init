import { ConflictError, NotFoundError } from "@/core/errors/AppError"
import type { CreateRoleData, UpdateRoleData } from "../domain/roles.entities"
import type { IRoleListResponse, IRoleResponse } from "../domain/roles.types"
import type { IRoleRepository } from "../domain/roles.interface"
import { mapRoleToResponse } from "./common/roles.mappers"

export const createRoleService = (repository: IRoleRepository) => ({
  async list(params?: { search?: string; page?: number; limit?: number }): Promise<IRoleListResponse> {
    const result = await repository.findAll(params)
    return {
      roles: result.roles.map(mapRoleToResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
    }
  },

  async getById(id: string): Promise<IRoleResponse> {
    const role = await repository.findById(id)
    if (!role) {
      throw new NotFoundError("Role not found")
    }
    return mapRoleToResponse(role)
  },

  async create(data: CreateRoleData): Promise<IRoleResponse> {
    const existing = await repository.findByName(data.name)
    if (existing) {
      throw new ConflictError("Role name already exists")
    }
    const role = await repository.create(data)
    return mapRoleToResponse(role)
  },

  async update(id: string, data: UpdateRoleData): Promise<IRoleResponse> {
    const existing = await repository.findById(id)
    if (!existing) {
      throw new NotFoundError("Role not found")
    }
    const role = await repository.update(id, data)
    return mapRoleToResponse(role)
  },

  async delete(id: string): Promise<void> {
    const existing = await repository.findById(id)
    if (!existing) {
      throw new NotFoundError("Role not found")
    }
    await repository.softDelete(id)
  },
})