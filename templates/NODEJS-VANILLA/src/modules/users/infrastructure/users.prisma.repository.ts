import { prisma } from "../../../config/prisma";
import type { IUserRepository } from "../domain/users.interface";

export const UserRepository: IUserRepository = {
  async findAll(params) {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = { deleted_at: null };
    if (params?.storeId) where.store_id = params.storeId;
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: limit, orderBy: { name: "asc" } }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  },

  async findById(id) {
    return await prisma.user.findFirst({ where: { id, deleted_at: null } });
  },

  async findByEmail(email, storeId) {
    const where: any = { email, deleted_at: null };
    if (storeId) where.store_id = storeId;
    return await prisma.user.findFirst({ where });
  },

  async create(data) {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role || "cajero",
        phone: data.phone,
        store_id: data.store_id!,
      },
    });

    if (data.password) {
      await prisma.account.create({
        data: {
          account_id: user.id,
          provider_id: "credentials",
          user_id: user.id,
          password: data.password,
        },
      });
    }

    return user;
  },

  async update(id, data) {
    return await prisma.user.update({ where: { id }, data });
  },

  async softDelete(id) {
    await prisma.user.update({ where: { id }, data: { deleted_at: new Date() } });
  },
};
