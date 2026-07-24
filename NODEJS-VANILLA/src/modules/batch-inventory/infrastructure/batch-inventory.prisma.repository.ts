import { prisma } from "../../../config/prisma";
import type { IBatchInventoryRepository } from "../domain/batch-inventory.interface";

export const BatchInventoryRepository: IBatchInventoryRepository = {
  async create(data) {
    return await prisma.inventory_batch.create({
      data: {
        movement_type: data.movement_type,
        supplier_id: data.supplier_id,
        notes: data.notes,
        user_id: data.user_id,
        store_id: data.store_id!,
        items: {
          create: data.items.map((item: any) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_cost: item.unit_cost,
            notes: item.notes,
          })),
        },
      },
      include: {
        items: {
          include: { product: { select: { id: true, name: true } } },
        },
        supplier: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });
  },

  async findById(id, storeId) {
    const where: any = { id };
    if (storeId) where.store_id = storeId;
    return await prisma.inventory_batch.findFirst({
      where,
      include: {
        items: {
          include: { product: { select: { id: true, name: true } } },
        },
        supplier: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });
  },

  async findAll(params) {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.storeId) where.store_id = params.storeId;
    if (params?.movement_type) where.movement_type = params.movement_type;
    if (params?.supplier_id) where.supplier_id = params.supplier_id;

    const [batches, total] = await Promise.all([
      prisma.inventory_batch.findMany({
        where,
        include: {
          items: {
            include: { product: { select: { id: true, name: true } } },
          },
          supplier: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.inventory_batch.count({ where }),
    ]);

    return { batches, total, page, limit };
  },
};
