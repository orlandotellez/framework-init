import { Router } from "express"
import { authController } from "./auth.controller.ts"
import { authGuard } from "../application/common/auth.guard.ts"

export const authRoutes = Router()

authRoutes.post("/login", authController.login)
authRoutes.post("/refresh", authController.refresh)
authRoutes.post("/logout", authController.logout)
authRoutes.get("/me", authGuard, authController.me)