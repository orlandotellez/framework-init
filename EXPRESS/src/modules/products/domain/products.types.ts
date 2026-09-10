export interface IProductResponse {
  id: string
  barcode: string | null
  name: string
  price: number
  cost: number | null
  stock: number
  low_stock_threshold: number
  active: boolean
  created_at: Date
  updated_at: Date
}

export interface IProductListResponse {
  products: IProductResponse[]
  total: number
  page: number
  limit: number
}