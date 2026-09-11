import { Router } from "../../../infrastructure/http/router";
import { salesController } from "./sales.controller";
import { authGuard } from "../../../core/guard/auth.guard";
import { storeGuard } from "../../../core/guard/store.guard";

const salesRouter = new Router();

salesRouter.get("/report", authGuard, storeGuard, salesController.report);
salesRouter.get("/revenue-trend", authGuard, storeGuard, salesController.revenueTrend);
salesRouter.get("/:id", authGuard, storeGuard, salesController.getById);
salesRouter.get("/", authGuard, storeGuard, salesController.list);
salesRouter.post("/", authGuard, storeGuard, salesController.create);

export { salesRouter };
