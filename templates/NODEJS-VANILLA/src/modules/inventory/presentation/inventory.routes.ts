import { Router } from "../../../infrastructure/http/router";
import { inventoryController } from "./inventory.controller";
import { authGuard } from "../../../core/guard/auth.guard";
import { storeGuard } from "../../../core/guard/store.guard";

const inventoryRouter = new Router();

inventoryRouter.get("/low-stock", authGuard, storeGuard, inventoryController.lowStock);
inventoryRouter.get("/product/:productId", authGuard, storeGuard, inventoryController.getByProduct);
inventoryRouter.get("/", authGuard, storeGuard, inventoryController.list);
inventoryRouter.post("/", authGuard, storeGuard, inventoryController.createMovement);

export { inventoryRouter };
