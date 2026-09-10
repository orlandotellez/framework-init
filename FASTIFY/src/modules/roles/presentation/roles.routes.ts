import type { FastifyInstance, FastifyPluginOptions } from "fastify"
import { rolesController } from "./roles.controller"
import { adminGuard, authGuard } from "@/modules/auth/application/common/auth.guard"

export const rolesRoutes = async (fastify: FastifyInstance, _opts: FastifyPluginOptions) => {
  fastify.get("/", { preHandler: [authGuard, adminGuard] }, rolesController.list)
  fastify.get("/:id", { preHandler: [authGuard, adminGuard] }, rolesController.getById)
  fastify.post("/", { preHandler: [authGuard, adminGuard] }, rolesController.create)
  fastify.put("/:id", { preHandler: [authGuard, adminGuard] }, rolesController.update)
  fastify.delete("/:id", { preHandler: [authGuard, adminGuard] }, rolesController.delete)
}