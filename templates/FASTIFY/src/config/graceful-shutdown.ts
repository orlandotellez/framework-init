import type { FastifyInstance } from "fastify"
import { logger } from "./logger"
import { prisma } from "./prisma"

export function gracefulShutdown(app: FastifyInstance) {
  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down")
    await app.close()
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"))
  process.on("SIGINT", () => shutdown("SIGINT"))
}