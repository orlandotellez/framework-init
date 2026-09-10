import type { Server } from "node:http"
import { logger } from "./logger.ts"
import { prisma } from "./prisma.ts"

export function gracefulShutdown(server: Server) {
  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down")
    server.close(async () => {
      await prisma.$disconnect()
      process.exit(0)
    })
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"))
  process.on("SIGINT", () => shutdown("SIGINT"))
}