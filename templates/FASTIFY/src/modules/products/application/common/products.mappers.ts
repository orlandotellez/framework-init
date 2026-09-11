import type { IProductEntity } from "../../domain/products.entities"
import type { IProductResponse } from "../../domain/products.types"

export function mapProductToResponse(product: IProductEntity): IProductResponse {
  return {
    id: product.id,
    barcode: product.barcode ?? null,
    name: product.name,
    price: Number(product.price),
    cost: product.cost ? Number(product.cost) : null,
    stock: product.stock,
    low_stock_threshold: product.low_stock_threshold,
    active: product.active,
    created_at: product.created_at,
    updated_at: product.updated_at,
  }
}