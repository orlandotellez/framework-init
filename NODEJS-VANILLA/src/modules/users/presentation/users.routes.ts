import { Router } from "../../../infrastructure/http/router";
import { usersController } from "./users.controller";
import { authGuard, adminGuard } from "../../../core/guard/auth.guard";
import { storeGuard } from "../../../core/guard/store.guard";

const usersRouter = new Router();

usersRouter.get("/", authGuard, adminGuard, storeGuard, usersController.list);
usersRouter.get("/:id", authGuard, adminGuard, storeGuard, usersController.getById);
usersRouter.post("/", authGuard, adminGuard, storeGuard, usersController.create);
usersRouter.put("/:id", authGuard, adminGuard, storeGuard, usersController.update);
usersRouter.delete("/:id", authGuard, adminGuard, storeGuard, usersController.delete);

export { usersRouter };
