import type { Request, Response } from "express"
import { createProductService } from "../application/products.service.ts"
import { ProductRepository } from "../infrastructure/products.prisma.repository.ts"
import { CreateProductDtoSchema, ProductQuerySchema, UpdateProductDtoSchema } from "./products.dto.ts"

const productService = createProductService(ProductRepository)

export const productsController = {
  async list(request: Request, response: Response) {
    const query = ProductQuerySchema.parse(request.query)
    const result = await productService.list({
      ...query,
      active: query.active === undefined ? undefined : query.active === "true",
    })
    return response.status(200).json(result)
  },

  async getById(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    const result = await productService.getById(id)
    return response.status(200).json(result)
  },

  async create(request: Request, response: Response) {
    const body = CreateProductDtoSchema.parse(request.body)
    const result = await productService.create(body)
    return response.status(201).json(result)
  },

  async update(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    const body = UpdateProductDtoSchema.parse(request.body)
    const result = await productService.update(id, body)
    return response.status(200).json(result)
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    await productService.delete(id)
    return response.status(200).json({ message: "Product deleted successfully" })
  },
}