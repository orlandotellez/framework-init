import type { RequestContext } from "../../infrastructure/http/types";
import { ForbiddenError } from "../errors/AppError";

export const storeGuard = async (ctx: RequestContext): Promise<void> => {
  if (!ctx.storeId) {
    throw new ForbiddenError("Store context required. Please login again.");
  }
};
