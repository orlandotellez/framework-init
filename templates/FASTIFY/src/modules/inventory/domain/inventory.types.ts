import type { MovementType } from "./inventory.entities"

export interface IInventoryMovementResponse {
  id: string
  product_id: string
  product: {
    id: string
    name: string
    barcode: string | null
  }
  user_id: string
  user: {
    id: string
    name: string
    email: string
  }
  type: MovementType
  quantity: number
  unit_cost: number | null
  note: string | null
  created_at: Date
}

export interface IInventoryMovementListResponse {
  movements: IInventoryMovementResponse[]
  total: number
  page: number
  limit: number
}

export interface ILowStockProduct {
  id: string
  name: string
  stock: number
  low_stock_threshold: number
}