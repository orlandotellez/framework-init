import type { FastifyInstance, FastifyPluginOptions } from "fastify"
import { authController } from "./auth.controller"
import { authGuard } from "../application/common/auth.guard"

export const authRoutes = async (fastify: FastifyInstance, _opts: FastifyPluginOptions) => {
  fastify.post("/login", authController.login)
  fastify.post("/refresh", authController.refresh)
  fastify.post("/logout", authController.logout)
  fastify.get("/me", { preHandler: [authGuard] }, authController.me)
}