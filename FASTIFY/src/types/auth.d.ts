export interface AuthTokenPayload {
  userId: string
  email: string
  role: string
}

export interface RefreshTokenPayload {
  userId: string
}