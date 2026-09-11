import { ConflictError, NotFoundError } from "../../../core/errors/AppError.ts"
import type { CreateMovementData, MovementType } from "../domain/inventory.entities.ts"
import type { IInventoryMovementListResponse, IInventoryMovementResponse, ILowStockProduct } from "../domain/inventory.types.ts"
import type { IInventoryRepository } from "../domain/inventory.interface.ts"
import { mapMovementToResponse } from "./common/inventory.mappers.ts"

function computeNewStock(currentStock: number, type: MovementType, quantity: number): number {
  if (type === "entrada") {
    return currentStock + quantity
  }
  if (type === "salida") {
    if (quantity > currentStock) {
      throw new ConflictError("Insufficient stock")
    }
    return currentStock - quantity
  }
  return quantity
}

export const createInventoryService = (repository: IInventoryRepository) => ({
  async listMovements(params?: { product_id?: string; type?: MovementType; page?: number; limit?: number }): Promise<IInventoryMovementListResponse> {
    const result = await repository.listMovements(params)
    return {
      movements: result.movements.map(mapMovementToResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
    }
  },

  async createMovement(data: CreateMovementData, userId: string): Promise<IInventoryMovementResponse> {
    const product = await repository.findProductById(data.product_id)
    if (!product || product.deleted_at) {
      throw new NotFoundError("Product not found")
    }

    const newStock = computeNewStock(product.stock, data.type, data.quantity)
    const movement = await repository.createMovement(data, userId, newStock)
    return mapMovementToResponse(movement)
  },

  async lowStock(): Promise<ILowStockProduct[]> {
    return repository.findLowStockProducts()
  },
})