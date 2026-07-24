import type { RequestContext } from "../../../infrastructure/http/types";
import { createSaleService } from "../application/sales.service";
import { SaleRepository } from "../infrastructure/sales.prisma.repository";
import { CreateSaleDtoSchema, SaleQuerySchema, ReportQuerySchema, RevenueTrendQuerySchema } from "./sales.dto";
import { UnauthorizedError } from "../../../core/errors/AppError";

const saleService = createSaleService(SaleRepository);

export const salesController = {
  create: async (ctx: RequestContext) => {
    const userId = ctx.userId;
    const storeId = ctx.storeId;
    if (!userId) throw new UnauthorizedError("Authentication required");

    const data = CreateSaleDtoSchema.parse(ctx.body);
    const result = await saleService.create({ ...data, user_id: userId }, storeId!);
    return { statusCode: 201, data: result };
  },

  getById: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    const storeId = ctx.storeId;
    const result = await saleService.getById(id, storeId!);
    return result;
  },

  list: async (ctx: RequestContext) => {
    const storeId = ctx.storeId;
    const query = SaleQuerySchema.parse(ctx.query);
    const result = await saleService.list({ ...query, storeId });
    return result;
  },

  report: async (ctx: RequestContext) => {
    const storeId = ctx.storeId;
    const query = ReportQuerySchema.parse(ctx.query);
    const result = await saleService.getReport({ ...query, storeId });
    return result;
  },

  revenueTrend: async (ctx: RequestContext) => {
    const storeId = ctx.storeId;
    const query = RevenueTrendQuerySchema.parse(ctx.query);
    const result = await saleService.getRevenueTrend({ ...query, store_id: storeId! });
    return result;
  },
};
