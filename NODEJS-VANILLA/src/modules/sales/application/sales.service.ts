import { NotFoundError, BadRequestError } from "../../../core/errors/AppError";
import { prisma } from "../../../config/prisma";
import type { ISaleRepository } from "../domain/sales.interface";
import type { ISaleResponse, ISaleListResponse, ISaleReport, IRevenueTrendItem, IRevenueTrendQuery } from "../domain/sales.types";

function mapSaleToResponse(sale: any): ISaleResponse {
  return {
    id: sale.id,
    subtotal: Number(sale.subtotal),
    tax_total: Number(sale.tax_total),
    discount: Number(sale.discount),
    total: Number(sale.total),
    payment_method: sale.payment_method,
    amount_received: sale.amount_received ? Number(sale.amount_received) : undefined,
    change_given: sale.change_given ? Number(sale.change_given) : undefined,
    user_id: sale.user_id,
    created_at: sale.created_at instanceof Date ? sale.created_at.toISOString() : sale.created_at,
    items: sale.items?.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      tax_rate: Number(item.tax_rate),
      line_total: Number(item.line_total),
    })),
    service_items: sale.service_items?.map((si: any) => ({
      id: si.id,
      service_id: si.service_id,
      service_name: si.service_name,
      base_price: Number(si.base_price),
      line_total: Number(si.line_total),
      products: si.products?.map((sp: any) => ({
        id: sp.id,
        product_id: sp.product_id,
        product_name: sp.product_name,
        quantity: sp.quantity,
        unit_price: Number(sp.unit_price),
        line_total: Number(sp.line_total),
        affects_price: sp.affects_price ?? false,
      })) || [],
    })),
  };
}

export const createSaleService = (repository: ISaleRepository) => ({
  create: async (data: any, storeId: string): Promise<ISaleResponse> => {
    const validationMap = new Map<string, { name: string; quantity: number; stock: number }>();
    const serviceProductMap = new Map<string, number>();

    if (data.items && data.items.length > 0) {
      const productIds = data.items.map((i: any) => i.product_id);
      const dbProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, price: true, stock: true },
      });
      const dbProductMap = new Map(dbProducts.map((p) => [p.id, p]));
      for (const item of data.items) {
        const dbProd = dbProductMap.get(item.product_id);
        if (!dbProd) throw new NotFoundError(`Product ${item.product_id} not found`);
        const existing = validationMap.get(item.product_id) || { name: dbProd.name, quantity: 0, stock: dbProd.stock };
        existing.quantity += item.quantity;
        validationMap.set(item.product_id, existing);
      }
    }

    if (data.service_items && data.service_items.length > 0) {
      for (const si of data.service_items) {
        if (si.products && si.products.length > 0) {
          for (const sp of si.products) {
            const dbProd = await prisma.product.findUnique({ where: { id: sp.product_id }, select: { id: true, name: true, stock: true } });
            if (!dbProd) throw new NotFoundError(`Product ${sp.product_id} not found`);
            const existing = validationMap.get(sp.product_id) || { name: dbProd.name, quantity: 0, stock: dbProd.stock };
            existing.quantity += sp.quantity;
            validationMap.set(sp.product_id, existing);
            serviceProductMap.set(sp.product_id, (serviceProductMap.get(sp.product_id) || 0) + sp.quantity);
          }
        }
      }
    }

    if (validationMap.size > 0) {
      const insufficientStock: string[] = [];
      for (const [, info] of validationMap) {
        if (info.stock < info.quantity) {
          insufficientStock.push(`${info.name} (disponible: ${info.stock}, requerido: ${info.quantity})`);
        }
      }
      if (insufficientStock.length > 0) throw new BadRequestError(`Insufficient stock for: ${insufficientStock.join(", ")}`);
    }

    const serviceProductsToDeduct = Array.from(serviceProductMap.entries()).map(([product_id, quantity]) => ({ product_id, quantity }));

    const sale = await repository.create(data, storeId, serviceProductsToDeduct);
    return mapSaleToResponse(sale);
  },

  getById: async (id: string, storeId: string): Promise<ISaleResponse> => {
    const sale = await repository.findById(id, storeId);
    if (!sale) throw new NotFoundError("Sale not found");
    return mapSaleToResponse(sale);
  },

  list: async (params?: any): Promise<ISaleListResponse> => {
    const result = await repository.findAll(params);
    return {
      sales: result.sales.map(mapSaleToResponse),
      total: result.total,
      page: params?.page || 1,
      limit: params?.limit || 50,
    };
  },

  getReport: async (params?: any): Promise<ISaleReport> => {
    return await repository.getReport(params);
  },

  getRevenueTrend: async (params: IRevenueTrendQuery): Promise<IRevenueTrendItem[]> => {
    return await repository.getRevenueTrend(params);
  },
});
