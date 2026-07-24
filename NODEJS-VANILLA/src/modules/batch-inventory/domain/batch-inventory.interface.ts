export interface IBatchInventoryRepository {
  create(data: any): Promise<any>;
  findById(id: string, storeId?: string): Promise<any>;
  findAll(params?: any): Promise<{ batches: any[]; total: number; page: number; limit: number }>;
}
