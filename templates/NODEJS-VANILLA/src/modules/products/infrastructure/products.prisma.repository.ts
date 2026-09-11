import { prisma } from "../../../config/prisma";
import type { IProductRepository } from "../domain/products.interface";
import type { IProductEntity, CreateProductData, UpdateProductData } from "../domain/products.entities";

function mapPrismaProductToEntity(product: any): IProductEntity {
  return {
    id: product.id,
    barcode: product.barcode,
    name: product.name,
    unit_type: product.unit_type,
    unit_quantity: product.unit_quantity,
    category_id: product.category_id,
    category_name: product.category?.name,
    supplier_id: product.supplier_id,
    price: Number(product.price),
    cost: Number(product.cost),
    tax_rate: Number(product.tax_rate),
    stock: product.stock,
    low_stock_threshold: product.low_stock_threshold,
    active: product.active,
    created_at: product.created_at,
    updated_at: product.updated_at,
    deleted_at: product.deleted_at,
  };
}

export const ProductRepository: IProductRepository = {
  async findAll(params) {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = { deleted_at: null };
    if (params?.storeId) where.store_id = params.storeId;
    if (params?.category_id) where.category_id = params.category_id;
    if (params?.active !== undefined) where.active = params.active;
    if (params?.lowStock) where.stock = { lte: prisma.product.fields.low_stock_threshold };
    if (params?.outOfStock) where.stock = 0;
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { barcode: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { id: true, name: true } }, supplier: { select: { id: true, name: true } } },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.product.count({ where }),
    ]);

    return { products: products.map(mapPrismaProductToEntity), total, page, limit };
  },

  async findById(id: string, storeId?: string) {
    const where: any = { id, deleted_at: null };
    if (storeId) where.store_id = storeId;
    const product = await prisma.product.findFirst({
      where,
      include: { category: { select: { id: true, name: true } }, supplier: { select: { id: true, name: true } } },
    });
    if (!product) return null;
    return mapPrismaProductToEntity(product);
  },

  async findByBarcode(barcode: string, storeId?: string) {
    const where: any = { barcode, deleted_at: null };
    if (storeId) where.store_id = storeId;
    const product = await prisma.product.findFirst({
      where,
      include: { category: { select: { id: true, name: true } }, supplier: { select: { id: true, name: true } } },
    });
    if (!product) return null;
    return mapPrismaProductToEntity(product);
  },

  async create(data: CreateProductData, storeId?: string) {
    const product = await prisma.product.create({
      data: {
        barcode: data.barcode,
        name: data.name,
        unit_type: data.unit_type as any,
        unit_quantity: data.unit_quantity,
        category_id: data.category_id,
        supplier_id: data.supplier_id,
        price: data.price,
        cost: data.cost || 0,
        tax_rate: data.tax_rate || 0,
        stock: data.stock || 0,
        low_stock_threshold: data.low_stock_threshold || 5,
        active: data.active !== undefined ? data.active : true,
        store_id: storeId!,
      },
      include: { category: { select: { id: true, name: true } }, supplier: { select: { id: true, name: true } } },
    });
    return mapPrismaProductToEntity(product);
  },

  async update(id: string, data: any, storeId?: string) {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true } }, supplier: { select: { id: true, name: true } } },
    });
    return mapPrismaProductToEntity(product);
  },

  async softDelete(id: string, storeId?: string) {
    await prisma.product.update({ where: { id }, data: { deleted_at: new Date() } });
  },

  async updateStock(id: string, quantity: number, storeId?: string) {
    const product = await prisma.product.update({
      where: { id },
      data: { stock: { increment: quantity } },
      include: { category: { select: { id: true, name: true } }, supplier: { select: { id: true, name: true } } },
    });
    return mapPrismaProductToEntity(product);
  },
};
