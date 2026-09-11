import { Prisma } from "@prisma/client"
import { prisma } from "../../../config/prisma.ts"
import { ConflictError } from "../../../core/errors/AppError.ts"
import type { IUserRepository } from "../domain/users.interface.ts"
import type { CreateUserData, IUserEntity, UpdateUserData } from "../domain/users.entities.ts"

const userSelect = {
  id: true,
  name: true,
  email: true,
  password_hash: true,
  role_id: true,
  role: { select: { id: true, name: true } },
  is_active: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
} as const

type UserRecord = Prisma.userGetPayload<{ select: typeof userSelect }>

function mapToEntity(user: UserRecord): IUserEntity {
  return {
    ...user,
    is_active: user.is_active ?? true,
    deleted_at: user.deleted_at ?? null,
  }
}

function isPrismaError(error: unknown, code: string): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
}

export const UserRepository: IUserRepository = {
  async findAll(params) {
    const where: Prisma.userWhereInput = { deleted_at: null }
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
      ]
    }

    const page = params?.page || 1
    const limit = params?.limit || 50
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, select: userSelect, skip, take: limit, orderBy: { name: "asc" } }),
      prisma.user.count({ where }),
    ])

    return { users: users.map(mapToEntity), total, page, limit }
  },

  async findById(id) {
    const user = await prisma.user.findFirst({ where: { id, deleted_at: null }, select: userSelect })
    return user ? mapToEntity(user) : null
  },

  async findByEmail(email) {
    const user = await prisma.user.findFirst({ where: { email, deleted_at: null }, select: userSelect })
    return user ? mapToEntity(user) : null
  },

  async create(data) {
    try {
      const user = await prisma.user.create({ data, select: userSelect })
      return mapToEntity(user)
    } catch (error) {
      if (isPrismaError(error, "P2002")) {
        throw new ConflictError("Email already registered")
      }
      if (isPrismaError(error, "P2003")) {
        throw new ConflictError("Role does not exist")
      }
      throw error
    }
  },

  async update(id, data) {
    const user = await prisma.user.update({ where: { id }, data, select: userSelect })
    return mapToEntity(user)
  },

  async softDelete(id) {
    await prisma.user.update({ where: { id }, data: { deleted_at: new Date() } })
  },
}