import type { FastifyInstance, FastifyPluginOptions } from "fastify"
import { usersController } from "./users.controller"
import { adminGuard, authGuard } from "@/modules/auth/application/common/auth.guard"

export const usersRoutes = async (fastify: FastifyInstance, _opts: FastifyPluginOptions) => {
  fastify.get("/", { preHandler: [authGuard, adminGuard] }, usersController.list)
  fastify.get("/:id", { preHandler: [authGuard, adminGuard] }, usersController.getById)
  fastify.post("/", { preHandler: [authGuard, adminGuard] }, usersController.create)
  fastify.put("/:id", { preHandler: [authGuard, adminGuard] }, usersController.update)
  fastify.patch("/:id/active", { preHandler: [authGuard, adminGuard] }, usersController.toggleActive)
  fastify.delete("/:id", { preHandler: [authGuard, adminGuard] }, usersController.delete)
}