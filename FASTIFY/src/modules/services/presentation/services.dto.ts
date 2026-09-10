import { z } from "zod"

export const CreateServiceDtoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  base_price: z.number().positive("Base price must be greater than zero"),
  is_active: z.boolean().optional().default(true),
})

export const UpdateServiceDtoSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().nullable().optional(),
  base_price: z.number().positive().optional(),
  is_active: z.boolean().optional(),
})

export const ServiceQuerySchema = z.object({
  search: z.string().optional(),
  active: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
})

export type CreateServiceDto = z.infer<typeof CreateServiceDtoSchema>
export type UpdateServiceDto = z.infer<typeof UpdateServiceDtoSchema>