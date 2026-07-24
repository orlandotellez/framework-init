export interface IServiceEntity {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  is_active: boolean;
  store_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export type CreateServiceData = {
  name: string;
  description?: string;
  base_price: number;
  is_active?: boolean;
  products?: { product_id: string; quantity: number }[];
};

export type UpdateServiceData = Partial<CreateServiceData>;
