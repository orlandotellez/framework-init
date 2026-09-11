import type { RequestContext } from "../../../infrastructure/http/types";
import { createSupplierService } from "../application/suppliers.service";
import { SupplierRepository } from "../infrastructure/suppliers.prisma.repository";
import { CreateSupplierDtoSchema, UpdateSupplierDtoSchema, SupplierQuerySchema } from "./suppliers.dto";

const supplierService = createSupplierService(SupplierRepository);

export const suppliersController = {
  list: async (ctx: RequestContext) => {
    const query = SupplierQuerySchema.parse(ctx.query);
    const result = await supplierService.list(query, ctx.storeId);
    return result;
  },

  getById: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    const result = await supplierService.getById(id, ctx.storeId);
    return result;
  },

  create: async (ctx: RequestContext) => {
    const data = CreateSupplierDtoSchema.parse(ctx.body);
    const result = await supplierService.create(data, ctx.storeId);
    return { statusCode: 201, data: result };
  },

  update: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    const data = UpdateSupplierDtoSchema.parse(ctx.body);
    const cleanData: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      cleanData[key] = value === null ? undefined : value;
    }
    const result = await supplierService.update(id, cleanData as any, ctx.storeId);
    return result;
  },

  delete: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    await supplierService.delete(id, ctx.storeId);
    return { message: "Supplier deleted successfully" };
  },
};
