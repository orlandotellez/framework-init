import { Router } from "../../../infrastructure/http/router";
import { categoriesController } from "./categories.controller";

const categoriesRouter = new Router();
categoriesRouter.get("/", categoriesController.list);

export { categoriesRouter };
