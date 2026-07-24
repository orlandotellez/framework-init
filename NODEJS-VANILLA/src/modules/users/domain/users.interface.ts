export interface IUserRepository {
  findAll(params?: any): Promise<{ users: any[]; total: number; page: number; limit: number }>;
  findById(id: string): Promise<any>;
  findByEmail(email: string, storeId?: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  softDelete(id: string): Promise<void>;
}
