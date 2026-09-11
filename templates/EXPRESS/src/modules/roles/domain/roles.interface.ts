import type { CreateRoleData, IRoleEntity, UpdateRoleData } from "./roles.entities.ts"

export interface IListRolesParams {
  search?: string
  page?: number
  limit?: number
}

export interface IListRolesResult {
  roles: IRoleEntity[]
  total: number
  page: number
  limit: number
}

export interface IRoleRepository {
  findAll(params?: IListRolesParams): Promise<IListRolesResult>
  findById(id: string): Promise<IRoleEntity | null>
  findByName(name: string): Promise<IRoleEntity | null>
  create(data: CreateRoleData): Promise<IRoleEntity>
  update(id: string, data: UpdateRoleData): Promise<IRoleEntity>
  softDelete(id: string): Promise<void>
}