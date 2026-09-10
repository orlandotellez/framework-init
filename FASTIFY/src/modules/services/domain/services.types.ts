export interface IServiceResponse {
  id: string
  name: string
  description: string | null
  base_price: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface IServiceListResponse {
  services: IServiceResponse[]
  total: number
  page: number
  limit: number
}