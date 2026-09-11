import { Router } from "../../../infrastructure/http/router";
import { suppliersController } from "./suppliers.controller";
import { authGuard } from "../../../core/guard/auth.guard";
import { storeGuard } from "../../../core/guard/store.guard";

const suppliersRouter = new Router();

suppliersRouter.get("/", authGuard, storeGuard, suppliersController.list);
suppliersRouter.get("/:id", authGuard, storeGuard, suppliersController.getById);
suppliersRouter.post("/", authGuard, storeGuard, suppliersController.create);
suppliersRouter.put("/:id", authGuard, storeGuard, suppliersController.update);
suppliersRouter.delete("/:id", authGuard, storeGuard, suppliersController.delete);

export { suppliersRouter };
