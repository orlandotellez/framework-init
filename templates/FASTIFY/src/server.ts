import { buildApp } from "./app"
import { env } from "./config/env"
import { logger } from "./config/logger"
import { gracefulShutdown } from "./config/graceful-shutdown"

const app = buildApp()

try {
  await app.listen({ port: env.PORT, host: env.HOST })
  logger.info(`Server listening on http://${env.HOST}:${env.PORT}`)
} catch (error) {
  logger.error(error, "Failed to start server")
  process.exit(1)
}

gracefulShutdown(app)