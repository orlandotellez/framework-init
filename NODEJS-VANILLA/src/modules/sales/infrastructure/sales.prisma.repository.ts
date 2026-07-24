import { prisma } from "../../../config/prisma";
import type { ISaleRepository } from "../domain/sales.interface";

export const SaleRepository: ISaleRepository = {
  async create(data, storeId, serviceProductsToDeduct, customServiceProducts) {
    const sale = await prisma.$transaction(async (tx) => {
      const created = await tx.sale.create({
        data: {
          subtotal: data.subtotal,
          tax_total: data.tax_total,
          discount: data.discount,
          total: data.total,
          payment_method: data.payment_method,
          amount_received: data.amount_received,
          change_given: data.change_given,
          user_id: data.user_id,
          store_id: storeId,
          items: {
            create: (data.items || []).map((item: any) => ({
              product_id: item.product_id,
              product_name: item.product_name,
              quantity: item.quantity,
              unit_price: item.unit_price,
              tax_rate: item.tax_rate,
              line_total: item.line_total,
            })),
          },
          service_items: {
            create: (data.service_items || []).map((si: any) => ({
              service_id: si.service_id,
              service_name: si.service_name,
              base_price: si.base_price,
              line_total: si.line_total,
              products: {
                create: (si.products || []).map((sp: any) => ({
                  product_id: sp.product_id,
                  product_name: sp.product_name,
                  quantity: sp.quantity,
                  unit_price: sp.unit_price,
                  line_total: sp.line_total,
                  affects_price: sp.affects_price || false,
                })),
              },
            })),
          },
        },
        include: {
          items: true,
          service_items: { include: { products: true } },
        },
      });

      // Deduct stock for regular items
      for (const item of (data.items || [])) {
        await tx.product.update({
          where: { id: item.product_id },
          data: { stock: { decrement: item.quantity } },
        });

        await tx.inventory_movement.create({
          data: {
            product_id: item.product_id,
            movement_type: "venta",
            quantity: item.quantity,
            note: `Sale ${created.id}`,
            user_id: data.user_id,
            store_id: storeId,
          },
        });
      }

      // Deduct stock for service products
      if (serviceProductsToDeduct && serviceProductsToDeduct.length > 0) {
        for (const sp of serviceProductsToDeduct) {
          await tx.product.update({
            where: { id: sp.product_id },
            data: { stock: { decrement: sp.quantity } },
          });

          await tx.inventory_movement.create({
            data: {
              product_id: sp.product_id,
              movement_type: "venta",
              quantity: sp.quantity,
              note: `Sale ${created.id} (service)`,
              user_id: data.user_id,
              store_id: storeId,
            },
          });
        }
      }

      return created;
    });

    return sale;
  },

  async findById(id, storeId) {
    return await prisma.sale.findFirst({
      where: { id, store_id: storeId },
      include: {
        items: true,
        service_items: { include: { products: true } },
      },
    });
  },

  async findAll(params) {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.storeId) where.store_id = params.storeId;
    if (params?.userId) where.user_id = params.userId;
    if (params?.paymentMethod) where.payment_method = params.paymentMethod;
    if (params?.startDate || params?.endDate) {
      where.created_at = {};
      if (params.startDate) where.created_at.gte = params.startDate;
      if (params.endDate) where.created_at.lte = params.endDate;
    }

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          items: true,
          service_items: { include: { products: true } },
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.sale.count({ where }),
    ]);

    return { sales, total };
  },

  async getReport(params) {
    const where: any = {};
    if (params?.storeId) where.store_id = params.storeId;
    if (params?.startDate || params?.endDate) {
      where.created_at = {};
      if (params.startDate) where.created_at.gte = params.startDate;
      if (params.endDate) where.created_at.lte = params.endDate;
    }

    const sales = await prisma.sale.findMany({ where, include: { items: true } });

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total), 0);
    const totalTax = sales.reduce((sum, s) => sum + Number(s.tax_total), 0);
    const totalDiscount = sales.reduce((sum, s) => sum + Number(s.discount), 0);
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    const salesByPaymentMethod = Object.entries(
      sales.reduce((acc, s) => {
        acc[s.payment_method] = (acc[s.payment_method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([method, count]) => ({ method, count }));

    const productMap = new Map<string, { productName: string; quantity: number; revenue: number }>();
    for (const sale of sales) {
      for (const item of sale.items) {
        const existing = productMap.get(item.product_id) || { productName: item.product_name, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += Number(item.line_total);
        productMap.set(item.product_id, existing);
      }
    }
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return { totalSales, totalRevenue, totalTax, totalDiscount, averageTicket, salesByPaymentMethod, topProducts };
  },

  async getRevenueTrend(params) {
    const where: any = {
      store_id: params.storeId,
      created_at: { gte: params.startDate, lte: params.endDate },
    };

    const sales = await prisma.sale.findMany({ where, select: { total: true, created_at: true } });

    const grouped = new Map<string, { revenue: number; sales_count: number }>();
    for (const sale of sales) {
      let key: string;
      const date = new Date(sale.created_at);
      if (params.groupBy === "month") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      } else if (params.groupBy === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else {
        key = date.toISOString().split("T")[0];
      }

      const existing = grouped.get(key) || { revenue: 0, sales_count: 0 };
      existing.revenue += Number(sale.total);
      existing.sales_count += 1;
      grouped.set(key, existing);
    }

    return Array.from(grouped.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
};
