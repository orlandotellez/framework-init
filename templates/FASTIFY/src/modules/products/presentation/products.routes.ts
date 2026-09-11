import type { FastifyInstance, FastifyPluginOptions } from "fastify"
import { productsController } from "./products.controller"
import { authGuard } from "@/modules/auth/application/common/auth.guard"

export const productsRoutes = async (fastify: FastifyInstance, _opts: FastifyPluginOptions) => {
  fastify.get("/", { preHandler: [authGuard] }, productsController.list)
  fastify.get("/:id", { preHandler: [authGuard] }, productsController.getById)
  fastify.post("/", { preHandler: [authGuard] }, productsController.create)
  fastify.put("/:id", { preHandler: [authGuard] }, productsController.update)
  fastify.delete("/:id", { preHandler: [authGuard] }, productsController.delete)
}