import { NotFoundError } from "../../../core/errors/AppError.ts"
import type { CreateServiceData, UpdateServiceData } from "../domain/services.entities.ts"
import type { IServiceListResponse, IServiceResponse } from "../domain/services.types.ts"
import type { IServiceRepository } from "../domain/services.interface.ts"
import { mapServiceToResponse } from "./common/services.mappers.ts"

export const createServiceService = (repository: IServiceRepository) => ({
  async list(params?: { search?: string; active?: boolean; page?: number; limit?: number }): Promise<IServiceListResponse> {
    const result = await repository.findAll(params)
    return {
      services: result.services.map(mapServiceToResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
    }
  },

  async getById(id: string): Promise<IServiceResponse> {
    const service = await repository.findById(id)
    if (!service) {
      throw new NotFoundError("Service not found")
    }
    return mapServiceToResponse(service)
  },

  async create(data: CreateServiceData): Promise<IServiceResponse> {
    const service = await repository.create(data)
    return mapServiceToResponse(service)
  },

  async update(id: string, data: UpdateServiceData): Promise<IServiceResponse> {
    const existing = await repository.findById(id)
    if (!existing) {
      throw new NotFoundError("Service not found")
    }
    const service = await repository.update(id, data)
    return mapServiceToResponse(service)
  },

  async delete(id: string): Promise<void> {
    const existing = await repository.findById(id)
    if (!existing) {
      throw new NotFoundError("Service not found")
    }
    await repository.softDelete(id)
  },
})