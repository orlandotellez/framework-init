export interface IRoleResponse {
  id: string
  name: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export interface IRoleListResponse {
  roles: IRoleResponse[]
  total: number
  page: number
  limit: number
}