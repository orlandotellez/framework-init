import type { RequestContext } from "../../../infrastructure/http/types";
import { createUserService } from "../application/users.service";
import { UserRepository } from "../infrastructure/users.prisma.repository";
import { CreateUserDtoSchema, UpdateUserDtoSchema, UserQuerySchema } from "./users.dto";

const userService = createUserService(UserRepository);

export const usersController = {
  list: async (ctx: RequestContext) => {
    const query = UserQuerySchema.parse(ctx.query);
    const result = await userService.list({ ...query, storeId: ctx.storeId });
    return result;
  },

  getById: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    const result = await userService.getById(id);
    return result;
  },

  create: async (ctx: RequestContext) => {
    const data = CreateUserDtoSchema.parse(ctx.body);
    const result = await userService.create({ ...data, store_id: ctx.storeId }, ctx.storeId);
    return { statusCode: 201, data: result };
  },

  update: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    const data = UpdateUserDtoSchema.parse(ctx.body);
    const result = await userService.update(id, data, ctx.storeId);
    return result;
  },

  delete: async (ctx: RequestContext) => {
    const { id } = ctx.params;
    const currentUserId = ctx.userId;

    if (id === currentUserId) {
      return { statusCode: 400, data: { message: "You cannot delete your own account" } };
    }

    await userService.delete(id);
    return { message: "User deleted successfully" };
  },
};
