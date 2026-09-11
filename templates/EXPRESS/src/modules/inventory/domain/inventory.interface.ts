import type { CreateMovementData, IInventoryMovementEntity, IProductStockInfo, MovementType } from "./inventory.entities.ts"
import type { ILowStockProduct } from "./inventory.types.ts"

export interface IListMovementsParams {
  product_id?: string
  type?: MovementType
  page?: number
  limit?: number
}

export interface IListMovementsResult {
  movements: IInventoryMovementEntity[]
  total: number
  page: number
  limit: number
}

export interface IInventoryRepository {
  findProductById(id: string): Promise<IProductStockInfo | null>
  listMovements(params?: IListMovementsParams): Promise<IListMovementsResult>
  createMovement(data: CreateMovementData, userId: string, newStock: number): Promise<IInventoryMovementEntity>
  findLowStockProducts(): Promise<ILowStockProduct[]>
}