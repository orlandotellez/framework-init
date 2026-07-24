import { Router } from "../../../infrastructure/http/router";
import { servicesController } from "./services.controller";
import { authGuard } from "../../../core/guard/auth.guard";
import { storeGuard } from "../../../core/guard/store.guard";

const servicesRouter = new Router();

servicesRouter.get("/", authGuard, storeGuard, servicesController.list);
servicesRouter.get("/:id", authGuard, storeGuard, servicesController.getById);
servicesRouter.post("/", authGuard, storeGuard, servicesController.create);
servicesRouter.put("/:id", authGuard, storeGuard, servicesController.update);
servicesRouter.delete("/:id", authGuard, storeGuard, servicesController.delete);

export { servicesRouter };
