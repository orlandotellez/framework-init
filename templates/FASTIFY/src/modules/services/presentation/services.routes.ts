import type { FastifyInstance, FastifyPluginOptions } from "fastify"
import { servicesController } from "./services.controller"
import { authGuard } from "@/modules/auth/application/common/auth.guard"

export const servicesRoutes = async (fastify: FastifyInstance, _opts: FastifyPluginOptions) => {
  fastify.get("/", { preHandler: [authGuard] }, servicesController.list)
  fastify.get("/:id", { preHandler: [authGuard] }, servicesController.getById)
  fastify.post("/", { preHandler: [authGuard] }, servicesController.create)
  fastify.put("/:id", { preHandler: [authGuard] }, servicesController.update)
  fastify.delete("/:id", { preHandler: [authGuard] }, servicesController.delete)
}