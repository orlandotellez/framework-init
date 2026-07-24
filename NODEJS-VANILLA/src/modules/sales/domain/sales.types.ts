export interface ISaleResponse {
  id: string;
  subtotal: number;
  tax_total: number;
  discount: number;
  total: number;
  payment_method: string;
  amount_received?: number;
  change_given?: number;
  user_id: string;
  created_at: string;
  items?: any[];
  service_items?: any[];
}

export interface ISaleListResponse {
  sales: ISaleResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ISaleReport {
  total_sales: number;
  total_revenue: number;
  total_tax: number;
  total_discount: number;
  average_ticket: number;
  sales_by_payment_method: any[];
  top_products: any[];
}

export interface IRevenueTrendItem {
  date: string;
  revenue: number;
  sales_count: number;
}

export interface IRevenueTrendQuery {
  start_date: string;
  end_date: string;
  group_by: string;
  store_id?: string;
}
