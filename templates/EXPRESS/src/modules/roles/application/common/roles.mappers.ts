import type { IRoleEntity } from "../../domain/roles.entities.ts"
import type { IRoleResponse } from "../../domain/roles.types.ts"

export function mapRoleToResponse(role: IRoleEntity): IRoleResponse {
  return {
    id: role.id,
    name: role.name,
    description: role.description ?? null,
    created_at: role.created_at,
    updated_at: role.updated_at,
  }
}