import type { RequestContext } from "../../../infrastructure/http/types";
import { createInventoryService } from "../application/inventory.service";
import { InventoryRepository } from "../infrastructure/inventory.prisma.repository";
import { ProductRepository } from "../../products/infrastructure/products.prisma.repository";
import { CreateMovementDtoSchema, MovementQuerySchema } from "./inventory.dto";
import { UnauthorizedError } from "../../../core/errors/AppError";

const inventoryService = createInventoryService(InventoryRepository, ProductRepository);

export const inventoryController = {
  createMovement: async (ctx: RequestContext) => {
    const userId = ctx.userId;
    if (!userId) throw new UnauthorizedError("Authentication required");

    const data = CreateMovementDtoSchema.parse(ctx.body);
    const result = await inventoryService.create({ ...data, user_id: userId, store_id: ctx.storeId });
    return { statusCode: 201, data: result };
  },

  getByProduct: async (ctx: RequestContext) => {
    const { productId } = ctx.params;
    const result = await inventoryService.getByProduct(productId, ctx.storeId);
    return result;
  },

  list: async (ctx: RequestContext) => {
    const query = MovementQuerySchema.parse(ctx.query);
    const result = await inventoryService.list({ ...query, storeId: ctx.storeId });
    return result;
  },

  lowStock: async (ctx: RequestContext) => {
    const result = await inventoryService.getLowStockProducts(ProductRepository);
    return { products: result };
  },
};
