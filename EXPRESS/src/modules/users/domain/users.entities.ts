export interface IUserEntity {
  id: string
  name: string
  email: string
  password_hash: string
  role_id: string
  role: {
    id: string
    name: string
  }
  is_active: boolean
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export type CreateUserData = {
  name: string
  email: string
  password_hash: string
  role_id: string
}

export type UpdateUserData = {
  name?: string
  email?: string
  role_id?: string
  is_active?: boolean
}