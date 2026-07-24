import type { RequestContext } from "../../../infrastructure/http/types";
import { createProductService } from "../application/products.service";
import { ProductRepository } from "../infrastructure/products.prisma.repository";
import type { UpdateProductData } from "../domain/products.entities";
import { CreateProductDtoSchema, UpdateProductDtoSchema, ProductQuerySchema } from "./products.dto";

const productService = createProductService(ProductRepository);

export const productsController = {
  list: async (ctx: RequestContext) => {
    const query = ProductQuerySchema.parse(ctx.query);
    const result = await productService.list({
      search: query.search,
      category_id: query.category_id,
      active: query.active,
      lowStock: query.low_stock,
      outOfStock: query.out_of_stock,
      page: query.page,
      limit: query.limit,
      storeId: ctx.storeId,
    });
    return result;
  },

  getById: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    const result = await productService.getById(id, ctx.storeId);
    return result;
  },

  getByBarcode: async (ctx: RequestContext) => {
    const { barcode } = ctx.params;
    const result = await productService.getByBarcode(barcode, ctx.storeId);
    if (!result) return { statusCode: 404, data: { message: "Product not found" } };
    return result;
  },

  create: async (ctx: RequestContext) => {
    const data = CreateProductDtoSchema.parse(ctx.body);
    const result = await productService.create(data, ctx.storeId);
    return { statusCode: 201, data: result };
  },

  update: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    const data = UpdateProductDtoSchema.parse(ctx.body);
    const result = await productService.update(id, data as UpdateProductData, ctx.storeId);
    return result;
  },

  delete: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    await productService.delete(id, ctx.storeId);
    return { message: "Product deleted successfully" };
  },
};
