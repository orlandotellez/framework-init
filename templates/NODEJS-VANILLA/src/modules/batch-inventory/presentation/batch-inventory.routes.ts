import { Router } from "../../../infrastructure/http/router";
import { batchInventoryController } from "./batch-inventory.controller";
import { authGuard } from "../../../core/guard/auth.guard";
import { storeGuard } from "../../../core/guard/store.guard";

const batchInventoryRouter = new Router();

batchInventoryRouter.get("/", authGuard, storeGuard, batchInventoryController.list);
batchInventoryRouter.get("/:id", authGuard, storeGuard, batchInventoryController.getById);
batchInventoryRouter.post("/", authGuard, storeGuard, batchInventoryController.create);

export { batchInventoryRouter };
