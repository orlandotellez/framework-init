import { prisma } from "../../../config/prisma";
import type { IServiceRepository } from "../domain/services.interface";

export const ServiceRepository: IServiceRepository = {
  async findAll(params) {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = { deleted_at: null };
    if (params?.storeId) where.store_id = params.storeId;
    if (params?.active !== undefined) where.is_active = params.active;
    if (params?.search) {
      where.name = { contains: params.search, mode: "insensitive" };
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: { service_products: { include: { product: { select: { id: true, name: true, price: true } } } } },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.service.count({ where }),
    ]);

    return { services, total, page, limit };
  },

  async findById(id, storeId) {
    const where: any = { id, deleted_at: null };
    if (storeId) where.store_id = storeId;
    return await prisma.service.findFirst({
      where,
      include: { service_products: { include: { product: { select: { id: true, name: true, price: true } } } } },
    });
  },

  async create(data, storeId) {
    return await prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        base_price: data.base_price,
        is_active: data.is_active !== undefined ? data.is_active : true,
        store_id: storeId!,
        service_products: data.products ? {
          create: data.products.map((p: any) => ({ product_id: p.product_id, quantity: p.quantity })),
        } : undefined,
      },
      include: { service_products: { include: { product: { select: { id: true, name: true, price: true } } } } },
    });
  },

  async update(id, data, storeId) {
    if (data.products) {
      await prisma.service_product.deleteMany({ where: { service_id: id } });
    }

    return await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        base_price: data.base_price,
        is_active: data.is_active,
        ...(data.products ? {
          service_products: {
            create: data.products.map((p: any) => ({ product_id: p.product_id, quantity: p.quantity })),
          },
        } : {}),
      },
      include: { service_products: { include: { product: { select: { id: true, name: true, price: true } } } } },
    });
  },

  async softDelete(id, storeId) {
    await prisma.service.update({ where: { id }, data: { deleted_at: new Date() } });
  },
};
