import { Router } from "../../../infrastructure/http/router";
import { productsController } from "./products.controller";
import { authGuard } from "../../../core/guard/auth.guard";
import { storeGuard } from "../../../core/guard/store.guard";

const productsRouter = new Router();

productsRouter.get("/", authGuard, storeGuard, productsController.list);
productsRouter.get("/barcode/:barcode", authGuard, storeGuard, productsController.getByBarcode);
productsRouter.get("/:id", authGuard, storeGuard, productsController.getById);
productsRouter.post("/", authGuard, storeGuard, productsController.create);
productsRouter.put("/:id", authGuard, storeGuard, productsController.update);
productsRouter.delete("/:id", authGuard, storeGuard, productsController.delete);

export { productsRouter };
