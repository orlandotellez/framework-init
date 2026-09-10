import type { IServiceEntity } from "../../domain/services.entities.ts"
import type { IServiceResponse } from "../../domain/services.types.ts"

export function mapServiceToResponse(service: IServiceEntity): IServiceResponse {
  return {
    id: service.id,
    name: service.name,
    description: service.description ?? null,
    base_price: Number(service.base_price),
    is_active: service.is_active,
    created_at: service.created_at,
    updated_at: service.updated_at,
  }
}