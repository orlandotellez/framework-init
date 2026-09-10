import { Prisma } from "@prisma/client"
import { prisma } from "@/config/prisma"
import type { IServiceRepository } from "../domain/services.interface"
import type { CreateServiceData, IServiceEntity, UpdateServiceData } from "../domain/services.entities"

const serviceSelect = {
  id: true,
  name: true,
  description: true,
  base_price: true,
  is_active: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
} as const

type ServiceRecord = Prisma.serviceGetPayload<{ select: typeof serviceSelect }>

function mapToEntity(service: ServiceRecord): IServiceEntity {
  return {
    ...service,
    description: service.description ?? null,
    deleted_at: service.deleted_at ?? null,
  }
}

export const ServiceRepository: IServiceRepository = {
  async findAll(params) {
    const where: Prisma.serviceWhereInput = { deleted_at: null }
    if (params?.search) {
      where.name = { contains: params.search, mode: "insensitive" }
    }
    if (params?.active !== undefined) {
      where.is_active = params.active
    }

    const page = params?.page || 1
    const limit = params?.limit || 50
    const skip = (page - 1) * limit

    const [services, total] = await Promise.all([
      prisma.service.findMany({ where, select: serviceSelect, skip, take: limit, orderBy: { name: "asc" } }),
      prisma.service.count({ where }),
    ])

    return { services: services.map(mapToEntity), total, page, limit }
  },

  async findById(id) {
    const service = await prisma.service.findFirst({ where: { id, deleted_at: null }, select: serviceSelect })
    return service ? mapToEntity(service) : null
  },

  async create(data) {
    const service = await prisma.service.create({ data, select: serviceSelect })
    return mapToEntity(service)
  },

  async update(id, data) {
    const service = await prisma.service.update({ where: { id }, data, select: serviceSelect })
    return mapToEntity(service)
  },

  async softDelete(id) {
    await prisma.service.update({ where: { id }, data: { deleted_at: new Date() } })
  },
}