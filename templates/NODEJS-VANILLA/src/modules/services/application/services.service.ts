import { NotFoundError, ConflictError } from "../../../core/errors/AppError";
import type { IServiceRepository } from "../domain/services.interface";
import type { IServiceResponse, IServiceListResponse } from "../domain/services.types";
import type { CreateServiceData, UpdateServiceData } from "../domain/services.entities";

function mapServiceToResponse(service: any): IServiceResponse {
  return {
    id: service.id,
    name: service.name,
    description: service.description || undefined,
    base_price: Number(service.base_price),
    is_active: service.is_active,
    products: (service.service_products || []).map((sp: any) => ({
      id: sp.id,
      product_id: sp.product_id,
      product_name: sp.product?.name || "Unknown",
      product_price: Number(sp.product?.price || 0),
      quantity: sp.quantity,
    })),
    created_at: service.created_at instanceof Date ? service.created_at.toISOString() : service.created_at,
    updated_at: service.updated_at instanceof Date ? service.updated_at.toISOString() : service.updated_at,
  };
}

export const createServiceService = (repository: IServiceRepository) => ({
  list: async (params?: any, storeId?: string): Promise<IServiceListResponse> => {
    const result = await repository.findAll({ ...params, storeId });
    return {
      services: result.services.map(mapServiceToResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  },

  getById: async (id: string, storeId?: string): Promise<IServiceResponse> => {
    const service = await repository.findById(id, storeId);
    if (!service || service.deleted_at) throw new NotFoundError("Service not found");
    return mapServiceToResponse(service);
  },

  create: async (data: CreateServiceData, storeId?: string): Promise<IServiceResponse> => {
    const service = await repository.create(data, storeId);
    return mapServiceToResponse(service);
  },

  update: async (id: string, data: UpdateServiceData, storeId?: string): Promise<IServiceResponse> => {
    const existing = await repository.findById(id, storeId);
    if (!existing || existing.deleted_at) throw new NotFoundError("Service not found");
    const service = await repository.update(id, data, storeId);
    return mapServiceToResponse(service);
  },

  delete: async (id: string, storeId?: string): Promise<void> => {
    const existing = await repository.findById(id, storeId);
    if (!existing || existing.deleted_at) throw new NotFoundError("Service not found");
    await repository.softDelete(id, storeId);
  },
});
