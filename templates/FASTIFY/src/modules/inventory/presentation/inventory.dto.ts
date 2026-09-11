import { z } from "zod"

export const CreateMovementDtoSchema = z.object({
  product_id: z.string().uuid("Invalid product id"),
  type: z.enum(["entrada", "salida", "ajuste"]),
  quantity: z.number().int().refine((q) => q !== 0, "Quantity must not be zero"),
  unit_cost: z.number().nonnegative().optional(),
  note: z.string().optional(),
})

export const MovementQuerySchema = z.object({
  product_id: z.string().uuid().optional(),
  type: z.enum(["entrada", "salida", "ajuste"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
})

export type CreateMovementDto = z.infer<typeof CreateMovementDtoSchema>