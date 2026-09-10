export interface IRoleEntity {
  id: string
  name: string
  description: string | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export type CreateRoleData = {
  name: string
  description?: string | null
}

export type UpdateRoleData = {
  name?: string
  description?: string | null
}