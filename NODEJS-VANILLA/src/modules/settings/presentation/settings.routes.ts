import { Router } from "../../../infrastructure/http/router";
import { settingsController } from "./settings.controller";
import { authGuard, adminGuard } from "../../../core/guard/auth.guard";
import { storeGuard } from "../../../core/guard/store.guard";

const settingsRouter = new Router();

settingsRouter.get("/", authGuard, storeGuard, settingsController.get);
settingsRouter.put("/", authGuard, adminGuard, storeGuard, settingsController.update);

export { settingsRouter };
