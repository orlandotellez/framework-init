import { prisma } from "../../../config/prisma";
import type { ISettingsRepository } from "../domain/settings.interface";

export const SettingsRepository: ISettingsRepository = {
  async get(storeId: string) {
    return await prisma.settings.findFirst({ where: { store_id: storeId } });
  },

  async upsert(data: any, storeId: string) {
    const existing = await prisma.settings.findFirst({ where: { store_id: storeId } });
    if (existing) {
      return await prisma.settings.update({ where: { id: existing.id }, data });
    }
    return await prisma.settings.create({ data: { ...data, store_id: storeId } });
  },
};
