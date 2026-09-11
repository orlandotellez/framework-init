import type { CreateUserData, IUserEntity, UpdateUserData } from "./users.entities.ts"

export interface IListUsersParams {
  search?: string
  page?: number
  limit?: number
}

export interface IListUsersResult {
  users: IUserEntity[]
  total: number
  page: number
  limit: number
}

export interface IUserRepository {
  findAll(params?: IListUsersParams): Promise<IListUsersResult>
  findById(id: string): Promise<IUserEntity | null>
  findByEmail(email: string): Promise<IUserEntity | null>
  create(data: CreateUserData): Promise<IUserEntity>
  update(id: string, data: UpdateUserData): Promise<IUserEntity>
  softDelete(id: string): Promise<void>
}