import { z } from "zod"

export const CreateProductDtoSchema = z.object({
  barcode: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().positive("Price must be greater than zero"),
  cost: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional().default(0),
  low_stock_threshold: z.number().int().nonnegative().optional().default(5),
  active: z.boolean().optional().default(true),
})

export const UpdateProductDtoSchema = z.object({
  barcode: z.string().nullable().optional(),
  name: z.string().min(2).optional(),
  price: z.number().positive().optional(),
  cost: z.number().nonnegative().nullable().optional(),
  low_stock_threshold: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
})

export const ProductQuerySchema = z.object({
  search: z.string().optional(),
  active: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
})

export type CreateProductDto = z.infer<typeof CreateProductDtoSchema>
export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>