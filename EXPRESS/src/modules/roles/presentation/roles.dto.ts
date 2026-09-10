import { z } from "zod"

export const CreateRoleDtoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  description: z.string().max(255).optional(),
})

export const UpdateRoleDtoSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(255).nullable().optional(),
})

export const RoleQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
})

export type CreateRoleDto = z.infer<typeof CreateRoleDtoSchema>
export type UpdateRoleDto = z.infer<typeof UpdateRoleDtoSchema>