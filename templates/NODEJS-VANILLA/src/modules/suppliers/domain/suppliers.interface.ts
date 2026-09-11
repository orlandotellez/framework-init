export interface ISupplierRepository {
  findAll(params?: any): Promise<{ suppliers: any[]; total: number; page: number; limit: number }>;
  findById(id: string, storeId?: string): Promise<any>;
  create(data: any, storeId?: string): Promise<any>;
  update(id: string, data: any, storeId?: string): Promise<any>;
  softDelete(id: string, storeId?: string): Promise<void>;
}
