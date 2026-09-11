export interface ISaleRepository {
  create(data: any, storeId: string, serviceProductsToDeduct?: any[], customServiceProducts?: any): Promise<any>;
  findById(id: string, storeId: string): Promise<any>;
  findAll(params: any): Promise<{ sales: any[]; total: number }>;
  getReport(params: any): Promise<any>;
  getRevenueTrend(params: any): Promise<any[]>;
}
