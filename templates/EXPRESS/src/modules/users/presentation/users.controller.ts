import type { Request, Response } from "express"
import { BadRequestError } from "../../../core/errors/AppError.ts"
import { createUserService } from "../application/users.service.ts"
import { UserRepository } from "../infrastructure/users.prisma.repository.ts"
import { CreateUserDtoSchema, ToggleActiveDtoSchema, UpdateUserDtoSchema, UserQuerySchema } from "./users.dto.ts"

const userService = createUserService(UserRepository)

export const usersController = {
  async list(request: Request, response: Response) {
    const query = UserQuerySchema.parse(request.query)
    const result = await userService.list(query)
    return response.status(200).json(result)
  },

  async getById(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    const result = await userService.getById(id)
    return response.status(200).json(result)
  },

  async create(request: Request, response: Response) {
    const body = CreateUserDtoSchema.parse(request.body)
    const result = await userService.create(body)
    return response.status(201).json(result)
  },

  async update(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    const body = UpdateUserDtoSchema.parse(request.body)
    const result = await userService.update(id, body)
    return response.status(200).json(result)
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    if (id === request.userId) {
      throw new BadRequestError("You cannot delete your own account")
    }
    await userService.delete(id)
    return response.status(200).json({ message: "User deleted successfully" })
  },

  async toggleActive(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    const { is_active } = ToggleActiveDtoSchema.parse(request.body)
    const result = await userService.update(id, { is_active })
    return response.status(200).json(result)
  },
}