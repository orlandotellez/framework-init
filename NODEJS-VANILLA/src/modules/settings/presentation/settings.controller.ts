import type { RequestContext } from "../../../infrastructure/http/types";
import { createSettingsService } from "../application/settings.service";
import { SettingsRepository } from "../infrastructure/settings.prisma.repository";
import { UpdateSettingsDtoSchema } from "./settings.dto";

const settingsService = createSettingsService(SettingsRepository);

export const settingsController = {
  get: async (ctx: RequestContext) => {
    const result = await settingsService.get(ctx.storeId!);
    return result;
  },

  update: async (ctx: RequestContext) => {
    const data = UpdateSettingsDtoSchema.parse(ctx.body);
    const cleanData: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      cleanData[key] = value === null ? undefined : value;
    }
    const result = await settingsService.upsert(cleanData as any, ctx.storeId!);
    return result;
  },
};
