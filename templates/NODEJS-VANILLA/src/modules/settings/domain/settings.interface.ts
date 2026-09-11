export interface ISettingsRepository {
  get(storeId: string): Promise<any>;
  upsert(data: any, storeId: string): Promise<any>;
}
