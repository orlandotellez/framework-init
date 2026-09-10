export interface IUserWithRole {
  id: string
  name: string
  email: string
  password_hash: string
  role: {
    id: string
    name: string
  }
  is_active: boolean
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface ISessionEntity {
  id: string
  user_id: string
  refresh_token: string
  expires_at: Date
  created_at: Date
}