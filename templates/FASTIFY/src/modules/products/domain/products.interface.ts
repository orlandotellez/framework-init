import type { CreateProductData, IProductEntity, UpdateProductData } from "./products.entities"

export interface IListProductsParams {
  search?: string
  active?: boolean
  page?: number
  limit?: number
}

export interface IListProductsResult {
  products: IProductEntity[]
  total: number
  page: number
  limit: number
}

export interface IProductRepository {
  findAll(params?: IListProductsParams): Promise<IListProductsResult>
  findById(id: string): Promise<IProductEntity | null>
  create(data: CreateProductData): Promise<IProductEntity>
  update(id: string, data: UpdateProductData): Promise<IProductEntity>
  softDelete(id: string): Promise<void>
}