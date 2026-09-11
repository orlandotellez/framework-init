export interface IUserResponse {
  id: string
  name: string
  email: string
  role: {
    id: string
    name: string
  }
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface IUserListResponse {
  users: IUserResponse[]
  total: number
  page: number
  limit: number
}