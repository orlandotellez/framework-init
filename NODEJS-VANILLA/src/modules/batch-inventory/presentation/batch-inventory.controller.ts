import type { RequestContext } from "../../../infrastructure/http/types";
import { createBatchInventoryService } from "../application/batch-inventory.service";
import { BatchInventoryRepository } from "../infrastructure/batch-inventory.prisma.repository";
import { ProductRepository } from "../../products/infrastructure/products.prisma.repository";
import { CreateBatchDtoSchema, BatchQuerySchema } from "./batch-inventory.dto";
import { UnauthorizedError } from "../../../core/errors/AppError";

const batchInventoryService = createBatchInventoryService(BatchInventoryRepository, ProductRepository);

export const batchInventoryController = {
  create: async (ctx: RequestContext) => {
    const userId = ctx.userId;
    if (!userId) throw new UnauthorizedError("Authentication required");

    const dto = CreateBatchDtoSchema.parse(ctx.body);
    const data: any = { ...dto };
    if (data.supplier_id === null) delete data.supplier_id;
    if (data.notes === null) delete data.notes;
    for (const item of data.items) {
      if (item.unit_cost === null) item.unit_cost = undefined;
      if (item.notes === null) item.notes = undefined;
    }
    const result = await batchInventoryService.create(data, userId, ctx.storeId);
    return { statusCode: 201, data: result };
  },

  list: async (ctx: RequestContext) => {
    const query = BatchQuerySchema.parse(ctx.query);
    const result = await batchInventoryService.list(query, ctx.storeId);
    return result;
  },

  getById: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    const result = await batchInventoryService.getById(id, ctx.storeId);
    return result;
  },
};
