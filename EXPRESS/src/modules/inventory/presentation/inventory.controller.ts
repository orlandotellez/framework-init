import type { Request, Response } from "express"
import { createInventoryService } from "../application/inventory.service.ts"
import { InventoryRepository } from "../infrastructure/inventory.prisma.repository.ts"
import { CreateMovementDtoSchema, MovementQuerySchema } from "./inventory.dto.ts"

const inventoryService = createInventoryService(InventoryRepository)

export const inventoryController = {
  async listMovements(request: Request, response: Response) {
    const query = MovementQuerySchema.parse(request.query)
    const result = await inventoryService.listMovements(query)
    return response.status(200).json(result)
  },

  async createMovement(request: Request, response: Response) {
    const body = CreateMovementDtoSchema.parse(request.body)
    const result = await inventoryService.createMovement(body, request.userId)
    return response.status(201).json(result)
  },

  async lowStock(request: Request, response: Response) {
    const result = await inventoryService.lowStock()
    return response.status(200).json(result)
  },
}