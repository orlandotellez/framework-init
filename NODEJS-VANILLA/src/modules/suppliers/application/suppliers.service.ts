import { NotFoundError, ConflictError } from "../../../core/errors/AppError";
import type { ISupplierRepository } from "../domain/suppliers.interface";
import type { ISupplierResponse, ISupplierListResponse } from "../domain/suppliers.types";
import type { CreateSupplierData, UpdateSupplierData } from "../domain/suppliers.entities";

function mapSupplierToResponse(supplier: any): ISupplierResponse {
  return {
    id: supplier.id,
    name: supplier.name,
    contact_name: supplier.contact_name || undefined,
    phone: supplier.phone || undefined,
    email: supplier.email || undefined,
    address: supplier.address || undefined,
    notes: supplier.notes || undefined,
    is_active: supplier.is_active,
    created_at: supplier.created_at instanceof Date ? supplier.created_at.toISOString() : supplier.created_at,
    updated_at: supplier.updated_at instanceof Date ? supplier.updated_at.toISOString() : supplier.updated_at,
  };
}

export const createSupplierService = (repository: ISupplierRepository) => ({
  list: async (params?: any, storeId?: string): Promise<ISupplierListResponse> => {
    const result = await repository.findAll({ ...params, storeId });
    return {
      suppliers: result.suppliers.map(mapSupplierToResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  },

  getById: async (id: string, storeId?: string): Promise<ISupplierResponse> => {
    const supplier = await repository.findById(id, storeId);
    if (!supplier || supplier.deleted_at) throw new NotFoundError("Supplier not found");
    return mapSupplierToResponse(supplier);
  },

  create: async (data: CreateSupplierData, storeId?: string): Promise<ISupplierResponse> => {
    const supplier = await repository.create(data, storeId);
    return mapSupplierToResponse(supplier);
  },

  update: async (id: string, data: UpdateSupplierData, storeId?: string): Promise<ISupplierResponse> => {
    const existing = await repository.findById(id, storeId);
    if (!existing || existing.deleted_at) throw new NotFoundError("Supplier not found");
    const supplier = await repository.update(id, data, storeId);
    return mapSupplierToResponse(supplier);
  },

  delete: async (id: string, storeId?: string): Promise<void> => {
    const existing = await repository.findById(id, storeId);
    if (!existing || existing.deleted_at) throw new NotFoundError("Supplier not found");
    await repository.softDelete(id, storeId);
  },
});
