import { Prisma } from "@prisma/client"
import { prisma } from "../../../config/prisma.ts"
import { ConflictError } from "../../../core/errors/AppError.ts"
import type { IRoleRepository } from "../domain/roles.interface.ts"
import type { CreateRoleData, IRoleEntity, UpdateRoleData } from "../domain/roles.entities.ts"

const roleSelect = {
  id: true,
  name: true,
  description: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
} as const

type RoleRecord = Prisma.roleGetPayload<{ select: typeof roleSelect }>

function mapToEntity(role: RoleRecord): IRoleEntity {
  return {
    ...role,
    description: role.description ?? null,
    deleted_at: role.deleted_at ?? null,
  }
}

function isPrismaError(error: unknown, code: string): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
}

export const RoleRepository: IRoleRepository = {
  async findAll(params) {
    const where: Prisma.roleWhereInput = { deleted_at: null }
    if (params?.search) {
      where.name = { contains: params.search, mode: "insensitive" }
    }

    const page = params?.page || 1
    const limit = params?.limit || 50
    const skip = (page - 1) * limit

    const [roles, total] = await Promise.all([
      prisma.role.findMany({ where, select: roleSelect, skip, take: limit, orderBy: { name: "asc" } }),
      prisma.role.count({ where }),
    ])

    return { roles: roles.map(mapToEntity), total, page, limit }
  },

  async findById(id) {
    const role = await prisma.role.findFirst({ where: { id, deleted_at: null }, select: roleSelect })
    return role ? mapToEntity(role) : null
  },

  async findByName(name) {
    const role = await prisma.role.findFirst({ where: { name, deleted_at: null }, select: roleSelect })
    return role ? mapToEntity(role) : null
  },

  async create(data) {
    try {
      const role = await prisma.role.create({ data, select: roleSelect })
      return mapToEntity(role)
    } catch (error) {
      if (isPrismaError(error, "P2002")) {
        throw new ConflictError("Role name already exists")
      }
      throw error
    }
  },

  async update(id, data) {
    try {
      const role = await prisma.role.update({ where: { id }, data, select: roleSelect })
      return mapToEntity(role)
    } catch (error) {
      if (isPrismaError(error, "P2002")) {
        throw new ConflictError("Role name already exists")
      }
      throw error
    }
  },

  async softDelete(id) {
    try {
      await prisma.role.update({ where: { id }, data: { deleted_at: new Date() } })
    } catch (error) {
      if (isPrismaError(error, "P2003")) {
        throw new ConflictError("Cannot delete a role assigned to users")
      }
      throw error
    }
  },
}