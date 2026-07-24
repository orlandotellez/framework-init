import { prisma } from "../../../config/prisma";
import type { IInventoryRepository } from "../domain/inventory.interface";

export const InventoryRepository: IInventoryRepository = {
  async create(data) {
    return await prisma.inventory_movement.create({ data });
  },

  async findByProductId(productId, params) {
    return await prisma.inventory_movement.findMany({
      where: { product_id: productId },
      orderBy: { created_at: "desc" },
    });
  },

  async findAll(params) {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.storeId) where.store_id = params.storeId;
    if (params?.product_id) where.product_id = params.product_id;
    if (params?.movement_type) where.movement_type = params.movement_type;

    const [movements, total] = await Promise.all([
      prisma.inventory_movement.findMany({ where, skip, take: limit, orderBy: { created_at: "desc" } }),
      prisma.inventory_movement.count({ where }),
    ]);

    return { movements, total, page, limit };
  },
};
