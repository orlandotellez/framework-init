import type { ISettingsRepository } from "../domain/settings.interface";
import type { ISettingsResponse } from "../domain/settings.types";
import type { UpdateSettingsData } from "../domain/settings.entities";

function mapSettingToResponse(setting: any): ISettingsResponse {
  return {
    name: setting.name,
    address: setting.address || undefined,
    phone: setting.phone || undefined,
    tax_rate: Number(setting.tax_rate),
    low_stock_threshold: setting.low_stock_threshold,
    ticket_footer: setting.ticket_footer || undefined,
    updated_at: setting.updated_at instanceof Date ? setting.updated_at.toISOString() : setting.updated_at,
  };
}

export const createSettingsService = (repository: ISettingsRepository) => ({
  get: async (storeId: string): Promise<ISettingsResponse> => {
    const setting = await repository.get(storeId);
    if (!setting) {
      const defaults = await repository.upsert({
        name: "Mi Negocio",
        tax_rate: 16,
        low_stock_threshold: 5,
      }, storeId);
      return mapSettingToResponse(defaults);
    }
    return mapSettingToResponse(setting);
  },

  upsert: async (data: UpdateSettingsData, storeId: string): Promise<ISettingsResponse> => {
    const setting = await repository.upsert(data, storeId);
    return mapSettingToResponse(setting);
  },
});
