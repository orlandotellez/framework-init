import type { Express } from "express"
import { authRoutes } from "../modules/auth/presentation/auth.routes.ts"
import { rolesRoutes } from "../modules/roles/presentation/roles.routes.ts"
import { usersRoutes } from "../modules/users/presentation/users.routes.ts"
import { productsRoutes } from "../modules/products/presentation/products.routes.ts"
import { servicesRoutes } from "../modules/services/presentation/services.routes.ts"
import { inventoryRoutes } from "../modules/inventory/presentation/inventory.routes.ts"

export function registerRoutes(app: Express) {
  app.use("/auth", authRoutes)
  app.use("/roles", rolesRoutes)
  app.use("/users", usersRoutes)
  app.use("/products", productsRoutes)
  app.use("/services", servicesRoutes)
  app.use("/inventory", inventoryRoutes)
}