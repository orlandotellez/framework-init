import { Router } from "./infrastructure/http/router";
import { createApp } from "./infrastructure/http/server";
import { env } from "./config/env";
import { authRouter } from "./modules/auth/presentation/auth.routes";
import { productsRouter } from "./modules/products/presentation/products.routes";
import { categoriesRouter } from "./modules/products/presentation/categories.routes";
import { salesRouter } from "./modules/sales/presentation/sales.routes";
import { inventoryRouter } from "./modules/inventory/presentation/inventory.routes";
import { usersRouter } from "./modules/users/presentation/users.routes";
import { servicesRouter } from "./modules/services/presentation/services.routes";
import { suppliersRouter } from "./modules/suppliers/presentation/suppliers.routes";
import { settingsRouter } from "./modules/settings/presentation/settings.routes";
import { batchInventoryRouter } from "./modules/batch-inventory/presentation/batch-inventory.routes";

const router = new Router();

// Health check
router.get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }));

// Module routes
router.register("/api/v1/auth", authRouter);
router.register("/api/v1/products", productsRouter);
router.register("/api/v1/categories", categoriesRouter);
router.register("/api/v1/sales", salesRouter);
router.register("/api/v1/inventory", inventoryRouter);
router.register("/api/v1/users", usersRouter);
router.register("/api/v1/services", servicesRouter);
router.register("/api/v1/suppliers", suppliersRouter);
router.register("/api/v1/settings", settingsRouter);
router.register("/api/v1/batch-inventory", batchInventoryRouter);

const corsOrigins = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(",").map((s) => s.trim()) : ["*"];

const app = createApp(router, corsOrigins);

export default app;
