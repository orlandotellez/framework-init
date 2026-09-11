export interface ISaleEntity {
  id: string;
  subtotal: number;
  tax_total: number;
  discount: number;
  total: number;
  payment_method: string;
  amount_received?: number;
  change_given?: number;
  user_id: string;
  store_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ISaleItemEntity {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
}

export interface ISaleServiceEntity {
  id: string;
  sale_id: string;
  service_id: string;
  service_name: string;
  base_price: number;
  line_total: number;
}

export interface ISaleServiceProductEntity {
  id: string;
  sale_service_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  affects_price: boolean;
}

export type CreateSaleData = {
  subtotal: number;
  tax_total: number;
  discount: number;
  total: number;
  payment_method: string;
  amount_received?: number;
  change_given?: number;
  items?: { product_id: string; product_name: string; quantity: number; unit_price: number; tax_rate: number; line_total: number }[];
  service_items?: { service_id: string; service_name: string; base_price: number; line_total: number; products?: { product_id: string; product_name: string; quantity: number; unit_price: number; line_total: number; affects_price?: boolean }[] }[];
  user_id: string;
};
