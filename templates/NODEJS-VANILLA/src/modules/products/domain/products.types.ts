export interface IProductResponse {
  id: string;
  barcode?: string;
  name: string;
  unit_type?: string;
  unit_quantity?: number;
  category?: { id: string; name: string };
  supplier?: { id: string; name: string };
  price: number;
  cost: number;
  tax_rate: number;
  stock: number;
  low_stock_threshold: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IProductListResponse {
  products: IProductResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface IProductCategory {
  id: string;
  name: string;
}
