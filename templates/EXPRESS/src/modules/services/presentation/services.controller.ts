import type { Request, Response } from "express"
import { createServiceService } from "../application/services.service.ts"
import { ServiceRepository } from "../infrastructure/services.prisma.repository.ts"
import { CreateServiceDtoSchema, ServiceQuerySchema, UpdateServiceDtoSchema } from "./services.dto.ts"

const serviceService = createServiceService(ServiceRepository)

export const servicesController = {
  async list(request: Request, response: Response) {
    const query = ServiceQuerySchema.parse(request.query)
    const result = await serviceService.list({
      ...query,
      active: query.active === undefined ? undefined : query.active === "true",
    })
    return response.status(200).json(result)
  },

  async getById(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    const result = await serviceService.getById(id)
    return response.status(200).json(result)
  },

  async create(request: Request, response: Response) {
    const body = CreateServiceDtoSchema.parse(request.body)
    const result = await serviceService.create(body)
    return response.status(201).json(result)
  },

  async update(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    const body = UpdateServiceDtoSchema.parse(request.body)
    const result = await serviceService.update(id, body)
    return response.status(200).json(result)
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params as { id: string }
    await serviceService.delete(id)
    return response.status(200).json({ message: "Service deleted successfully" })
  },
}