export interface IBatchInventoryEntity {
  id: string;
  movement_type: string;
  supplier_id?: string;
  notes?: string;
  user_id: string;
  store_id: string;
  created_at: Date;
}

export type CreateBatchData = {
  movement_type: string;
  supplier_id?: string;
  notes?: string;
  items: { product_id: string; quantity: number; unit_cost?: number; notes?: string }[];
  user_id?: string;
  store_id?: string;
};
