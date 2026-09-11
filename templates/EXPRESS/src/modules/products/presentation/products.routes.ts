import { Router } from "express"
import { productsController } from "./products.controller.ts"
import { authGuard } from "../../auth/application/common/auth.guard.ts"

export const productsRoutes = Router()

productsRoutes.get("/", authGuard, productsController.list)
productsRoutes.get("/:id", authGuard, productsController.getById)
productsRoutes.post("/", authGuard, productsController.create)
productsRoutes.put("/:id", authGuard, productsController.update)
productsRoutes.delete("/:id", authGuard, productsController.delete)