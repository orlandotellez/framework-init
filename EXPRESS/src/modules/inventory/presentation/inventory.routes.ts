import { Router } from "express"
import { inventoryController } from "./inventory.controller.ts"
import { authGuard } from "../../auth/application/common/auth.guard.ts"

export const inventoryRoutes = Router()

inventoryRoutes.get("/movements", authGuard, inventoryController.listMovements)
inventoryRoutes.post("/movements", authGuard, inventoryController.createMovement)
inventoryRoutes.get("/products/low-stock", authGuard, inventoryController.lowStock)