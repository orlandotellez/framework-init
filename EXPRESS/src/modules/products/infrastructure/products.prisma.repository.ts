import { Prisma } from "@prisma/client"
import { prisma } from "../../../config/prisma.ts"
import { ConflictError } from "../../../core/errors/AppError.ts"
import type { IProductRepository } from "../domain/products.interface.ts"
import type { CreateProductData, IProductEntity, UpdateProductData } from "../domain/products.entities.ts"

const productSelect = {
  id: true,
  barcode: true,
  name: true,
  price: true,
  cost: true,
  stock: true,
  low_stock_threshold: true,
  active: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
} as const

type ProductRecord = Prisma.productGetPayload<{ select: typeof productSelect }>

function mapToEntity(product: ProductRecord): IProductEntity {
  return {
    ...product,
    barcode: product.barcode ?? null,
    cost: product.cost ?? null,
    deleted_at: product.deleted_at ?? null,
  }
}

function isPrismaError(error: unknown, code: string): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
}

export const ProductRepository: IProductRepository = {
  async findAll(params) {
    const where: Prisma.productWhereInput = { deleted_at: null }
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { barcode: { contains: params.search, mode: "insensitive" } },
      ]
    }
    if (params?.active !== undefined) {
      where.active = params.active
    }

    const page = params?.page || 1
    const limit = params?.limit || 50
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, select: productSelect, skip, take: limit, orderBy: { name: "asc" } }),
      prisma.product.count({ where }),
    ])

    return { products: products.map(mapToEntity), total, page, limit }
  },

  async findById(id) {
    const product = await prisma.product.findFirst({ where: { id, deleted_at: null }, select: productSelect })
    return product ? mapToEntity(product) : null
  },

  async create(data) {
    try {
      const product = await prisma.product.create({ data, select: productSelect })
      return mapToEntity(product)
    } catch (error) {
      if (isPrismaError(error, "P2002")) {
        throw new ConflictError("Barcode already exists")
      }
      throw error
    }
  },

  async update(id, data) {
    try {
      const product = await prisma.product.update({ where: { id }, data, select: productSelect })
      return mapToEntity(product)
    } catch (error) {
      if (isPrismaError(error, "P2002")) {
        throw new ConflictError("Barcode already exists")
      }
      throw error
    }
  },

  async softDelete(id) {
    await prisma.product.update({ where: { id }, data: { deleted_at: new Date() } })
  },
}