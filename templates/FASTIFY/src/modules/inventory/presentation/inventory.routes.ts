import type { FastifyInstance, FastifyPluginOptions } from "fastify"
import { inventoryController } from "./inventory.controller"
import { authGuard } from "@/modules/auth/application/common/auth.guard"

export const inventoryRoutes = async (fastify: FastifyInstance, _opts: FastifyPluginOptions) => {
  fastify.get("/movements", { preHandler: [authGuard] }, inventoryController.listMovements)
  fastify.post("/movements", { preHandler: [authGuard] }, inventoryController.createMovement)
  fastify.get("/products/low-stock", { preHandler: [authGuard] }, inventoryController.lowStock)
}