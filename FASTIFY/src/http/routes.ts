import type { FastifyInstance } from "fastify"
import { authRoutes } from "@/modules/auth/presentation/auth.routes"
import { rolesRoutes } from "@/modules/roles/presentation/roles.routes"
import { usersRoutes } from "@/modules/users/presentation/users.routes"
import { productsRoutes } from "@/modules/products/presentation/products.routes"
import { servicesRoutes } from "@/modules/services/presentation/services.routes"
import { inventoryRoutes } from "@/modules/inventory/presentation/inventory.routes"

export function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: "/auth" })
  app.register(rolesRoutes, { prefix: "/roles" })
  app.register(usersRoutes, { prefix: "/users" })
  app.register(productsRoutes, { prefix: "/products" })
  app.register(servicesRoutes, { prefix: "/services" })
  app.register(inventoryRoutes, { prefix: "/inventory" })
}