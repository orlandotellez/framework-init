export interface IBatchResponse {
  id: string;
  movement_type: string;
  supplier_id?: string;
  supplier_name?: string;
  notes?: string;
  user_id: string;
  user_name?: string;
  items: any[];
  total_items: number;
  total_quantity: number;
  created_at: string;
}

export interface IBatchListResponse {
  batches: IBatchResponse[];
  total: number;
  page: number;
  limit: number;
}
