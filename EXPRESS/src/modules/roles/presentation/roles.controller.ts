import type { Request, Response } from "express"
import { createRoleService } from "../application/roles.service.ts"
import { RoleRepository } from "../infrastructure/roles.prisma.repository.ts"
import { CreateRoleDtoSchema, RoleQuerySchema, UpdateRoleDtoSchema } from "./roles.dto.ts"

const roleService = createRoleService(RoleRepository)

export const rolesController = {
  async list(request: Request, response: Response) {
    const query = RoleQuerySchema.parse(request.query)
    const result = await roleService.list(query)
    return response.status(200).json(result)
  },

  async getById(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    const result = await roleService.getById(id)
    return response.status(200).json(result)
  },

  async create(request: Request, response: Response) {
    const body = CreateRoleDtoSchema.parse(request.body)
    const result = await roleService.create(body)
    return response.status(201).json(result)
  },

  async update(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    const body = UpdateRoleDtoSchema.parse(request.body)
    const result = await roleService.update(id, body)
    return response.status(200).json(result)
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    await roleService.delete(id)
    return response.status(200).json({ message: "Role deleted successfully" })
  },
}