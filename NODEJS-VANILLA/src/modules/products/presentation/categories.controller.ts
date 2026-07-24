import type { RequestContext } from "../../../infrastructure/http/types";
import { prisma } from "../../../config/prisma";

export const categoriesController = {
  list: async (ctx: RequestContext) => {
    const categories = await prisma.category.findMany({
      where: {
        deleted_at: null,
        ...(ctx.storeId ? { store_id: ctx.storeId } : {}),
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, description: true },
    });
    return categories;
  },
};
