import type { CreateServiceData, IServiceEntity, UpdateServiceData } from "./services.entities.ts"

export interface IListServicesParams {
  search?: string
  active?: boolean
  page?: number
  limit?: number
}

export interface IListServicesResult {
  services: IServiceEntity[]
  total: number
  page: number
  limit: number
}

export interface IServiceRepository {
  findAll(params?: IListServicesParams): Promise<IListServicesResult>
  findById(id: string): Promise<IServiceEntity | null>
  create(data: CreateServiceData): Promise<IServiceEntity>
  update(id: string, data: UpdateServiceData): Promise<IServiceEntity>
  softDelete(id: string): Promise<void>
}