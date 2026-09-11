export interface IInventoryRepository {
  create(data: any): Promise<any>;
  findByProductId(productId: string, params?: any): Promise<any[]>;
  findAll(params?: any): Promise<{ movements: any[]; total: number; page: number; limit: number }>;
}
