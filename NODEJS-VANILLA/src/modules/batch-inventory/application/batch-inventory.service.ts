import { NotFoundError } from "../../../core/errors/AppError";
import type { IBatchInventoryRepository } from "../domain/batch-inventory.interface";
import type { IBatchResponse, IBatchListResponse } from "../domain/batch-inventory.types";
import type { CreateBatchData } from "../domain/batch-inventory.entities";
import type { IProductRepository } from "../../products/domain/products.interface";
import { ProductRepository } from "../../products/infrastructure/products.prisma.repository";

function mapBatchToResponse(batch: any): IBatchResponse {
  return {
    id: batch.id,
    movement_type: batch.movement_type,
    supplier_id: batch.supplier_id || undefined,
    supplier_name: batch.supplier?.name || undefined,
    notes: batch.notes || undefined,
    user_id: batch.user_id,
    user_name: batch.user?.name || undefined,
    items: (batch.items || []).map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      product_name: item.product?.name || "Unknown",
      quantity: item.quantity,
      unit_cost: item.unit_cost ? Number(item.unit_cost) : undefined,
      notes: item.notes || undefined,
    })),
    total_items: (batch.items || []).length,
    total_quantity: (batch.items || []).reduce((sum: number, item: any) => sum + item.quantity, 0),
    created_at: batch.created_at instanceof Date ? batch.created_at.toISOString() : batch.created_at,
  };
}

export const createBatchInventoryService = (
  repository: IBatchInventoryRepository,
  productRepo?: IProductRepository
) => {
  const products = productRepo || ProductRepository;
  return {
    create: async (data: CreateBatchData, userId: string, storeId?: string): Promise<IBatchResponse> => {
      const batch = await repository.create({
        ...data,
        user_id: userId,
        store_id: storeId,
      });

      // Update stock for each item
      for (const item of data.items) {
        const stockAdjustment =
          data.movement_type === "entrada" ? item.quantity
          : data.movement_type === "salida" ? -item.quantity
          : item.quantity;

        await products.updateStock(item.product_id, stockAdjustment);
      }

      return mapBatchToResponse(batch);
    },

    list: async (params?: any, storeId?: string): Promise<IBatchListResponse> => {
      const result = await repository.findAll({ ...params, storeId });
      return {
        batches: result.batches.map(mapBatchToResponse),
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    },

    getById: async (id: string, storeId?: string): Promise<IBatchResponse> => {
      const batch = await repository.findById(id, storeId);
      if (!batch) throw new NotFoundError("Batch not found");
      return mapBatchToResponse(batch);
    },
  };
};
