import type { IInventoryMovementEntity } from "../../domain/inventory.entities"
import type { IInventoryMovementResponse } from "../../domain/inventory.types"

export function mapMovementToResponse(movement: IInventoryMovementEntity): IInventoryMovementResponse {
  return {
    id: movement.id,
    product_id: movement.product_id,
    product: movement.product,
    user_id: movement.user_id,
    user: movement.user,
    type: movement.type,
    quantity: movement.quantity,
    unit_cost: movement.unit_cost ? Number(movement.unit_cost) : null,
    note: movement.note ?? null,
    created_at: movement.created_at,
  }
}