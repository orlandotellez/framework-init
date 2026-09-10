import { Router } from "express"
import { usersController } from "./users.controller.ts"
import { adminGuard, authGuard } from "../../auth/application/common/auth.guard.ts"

export const usersRoutes = Router()

usersRoutes.get("/", authGuard, adminGuard, usersController.list)
usersRoutes.get("/:id", authGuard, adminGuard, usersController.getById)
usersRoutes.post("/", authGuard, adminGuard, usersController.create)
usersRoutes.put("/:id", authGuard, adminGuard, usersController.update)
usersRoutes.patch("/:id/active", authGuard, adminGuard, usersController.toggleActive)
usersRoutes.delete("/:id", authGuard, adminGuard, usersController.delete)