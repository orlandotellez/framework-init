import { Prisma } from "@prisma/client"
import { prisma } from "@/config/prisma"
import type { IInventoryRepository } from "../domain/inventory.interface"
import type { CreateMovementData, IInventoryMovementEntity, MovementType } from "../domain/inventory.entities"

const movementSelect = {
  id: true,
  product_id: true,
  product: { select: { id: true, name: true, barcode: true } },
  user_id: true,
  user: { select: { id: true, name: true, email: true } },
  type: true,
  quantity: true,
  unit_cost: true,
  note: true,
  created_at: true,
} as const

type MovementRecord = Prisma.inventory_movementGetPayload<{ select: typeof movementSelect }>

function mapToEntity(movement: MovementRecord): IInventoryMovementEntity {
  return {
    ...movement,
    type: movement.type as MovementType,
    unit_cost: movement.unit_cost ?? null,
    note: movement.note ?? null,
  }
}

export const InventoryRepository: IInventoryRepository = {
  async findProductById(id) {
    return prisma.product.findFirst({
      where: { id },
      select: { id: true, stock: true, active: true, deleted_at: true },
    })
  },

  async listMovements(params) {
    const where: Prisma.inventory_movementWhereInput = {}
    if (params?.product_id) {
      where.product_id = params.product_id
    }
    if (params?.type) {
      where.type = params.type
    }

    const page = params?.page || 1
    const limit = params?.limit || 50
    const skip = (page - 1) * limit

    const [movements, total] = await Promise.all([
      prisma.inventory_movement.findMany({ where, select: movementSelect, skip, take: limit, orderBy: { created_at: "desc" } }),
      prisma.inventory_movement.count({ where }),
    ])

    return { movements: movements.map(mapToEntity), total, page, limit }
  },

  async createMovement(data, userId, newStock) {
    const [movement] = await prisma.$transaction([
      prisma.inventory_movement.create({
        data: {
          product_id: data.product_id,
          user_id: userId,
          type: data.type,
          quantity: data.quantity,
          unit_cost: data.unit_cost ?? null,
          note: data.note ?? null,
        },
        select: movementSelect,
      }),
      prisma.product.update({
        where: { id: data.product_id },
        data: { stock: newStock },
      }),
    ])

    return mapToEntity(movement)
  },

  async findLowStockProducts() {
    return prisma.product.findMany({
      where: {
        deleted_at: null,
        active: true,
        stock: { lte: prisma.product.fields.low_stock_threshold },
      },
      select: { id: true, name: true, stock: true, low_stock_threshold: true },
      orderBy: { stock: "asc" },
    })
  },
}