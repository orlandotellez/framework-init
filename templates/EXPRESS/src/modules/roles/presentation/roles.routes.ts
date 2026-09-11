import { Router } from "express"
import { rolesController } from "./roles.controller.ts"
import { adminGuard, authGuard } from "../../auth/application/common/auth.guard.ts"

export const rolesRoutes = Router()

rolesRoutes.get("/", authGuard, adminGuard, rolesController.list)
rolesRoutes.get("/:id", authGuard, adminGuard, rolesController.getById)
rolesRoutes.post("/", authGuard, adminGuard, rolesController.create)
rolesRoutes.put("/:id", authGuard, adminGuard, rolesController.update)
rolesRoutes.delete("/:id", authGuard, adminGuard, rolesController.delete)