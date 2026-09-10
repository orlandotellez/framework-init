import { Router } from "express"
import { servicesController } from "./services.controller.ts"
import { authGuard } from "../../auth/application/common/auth.guard.ts"

export const servicesRoutes = Router()

servicesRoutes.get("/", authGuard, servicesController.list)
servicesRoutes.get("/:id", authGuard, servicesController.getById)
servicesRoutes.post("/", authGuard, servicesController.create)
servicesRoutes.put("/:id", authGuard, servicesController.update)
servicesRoutes.delete("/:id", authGuard, servicesController.delete)