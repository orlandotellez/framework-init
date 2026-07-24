import type { RequestContext } from "../../../infrastructure/http/types";
import { createServiceService } from "../application/services.service";
import { ServiceRepository } from "../infrastructure/services.prisma.repository";
import { CreateServiceDtoSchema, UpdateServiceDtoSchema, ServiceQuerySchema } from "./services.dto";

const serviceService = createServiceService(ServiceRepository);

export const servicesController = {
  list: async (ctx: RequestContext) => {
    const query = ServiceQuerySchema.parse(ctx.query);
    const result = await serviceService.list(query, ctx.storeId);
    return result;
  },

  getById: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    const result = await serviceService.getById(id, ctx.storeId);
    return result;
  },

  create: async (ctx: RequestContext) => {
    const data = CreateServiceDtoSchema.parse(ctx.body);
    const result = await serviceService.create(data, ctx.storeId);
    return { statusCode: 201, data: result };
  },

  update: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    const data = UpdateServiceDtoSchema.parse(ctx.body);
    const cleanData: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      cleanData[key] = value === null ? undefined : value;
    }
    const result = await serviceService.update(id, cleanData as any, ctx.storeId);
    return result;
  },

  delete: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    await serviceService.delete(id, ctx.storeId);
    return { message: "Service deleted successfully" };
  },
};
