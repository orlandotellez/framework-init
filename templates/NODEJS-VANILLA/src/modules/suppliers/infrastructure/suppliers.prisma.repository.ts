import { prisma } from "../../../config/prisma";
import type { ISupplierRepository } from "../domain/suppliers.interface";

export const SupplierRepository: ISupplierRepository = {
  async findAll(params) {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = { deleted_at: null };
    if (params?.storeId) where.store_id = params.storeId;
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { contact_name: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({ where, skip, take: limit, orderBy: { name: "asc" } }),
      prisma.supplier.count({ where }),
    ]);

    return { suppliers, total, page, limit };
  },

  async findById(id, storeId) {
    const where: any = { id, deleted_at: null };
    if (storeId) where.store_id = storeId;
    return await prisma.supplier.findFirst({ where });
  },

  async create(data, storeId) {
    return await prisma.supplier.create({
      data: {
        name: data.name,
        contact_name: data.contact_name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        store_id: storeId!,
      },
    });
  },

  async update(id, data, storeId) {
    return await prisma.supplier.update({ where: { id }, data });
  },

  async softDelete(id, storeId) {
    await prisma.supplier.update({ where: { id }, data: { deleted_at: new Date() } });
  },
};
