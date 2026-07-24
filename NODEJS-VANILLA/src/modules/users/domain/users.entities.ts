export interface IUserEntity {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  phone?: string;
  image?: string;
  role: string;
  store_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  store_id?: string;
};

export type UpdateUserData = {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
};
