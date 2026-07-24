export interface IProductEntity {
  id: string;
  barcode?: string;
  name: string;
  unit_type?: string;
  unit_quantity?: number;
  category_id?: string;
  category_name?: string;
  supplier_id?: string;
  price: number;
  cost: number;
  tax_rate: number;
  stock: number;
  low_stock_threshold: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export type CreateProductData = {
  barcode?: string;
  name: string;
  unit_type?: string;
  unit_quantity?: number;
  category_id?: string;
  supplier_id?: string;
  price: number;
  cost?: number;
  tax_rate?: number;
  stock?: number;
  low_stock_threshold?: number;
  active?: boolean;
};

export type UpdateProductData = Partial<CreateProductData>;
