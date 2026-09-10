import type { IUserEntity } from "../../domain/users.entities"
import type { IUserResponse } from "../../domain/users.types"

export function mapUserToResponse(user: IUserEntity): IUserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }
}