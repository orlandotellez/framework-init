import { buildApp } from "./app.ts"
import { env } from "./config/env.ts"
import { logger } from "./config/logger.ts"
import { gracefulShutdown } from "./config/graceful-shutdown.ts"

const app = buildApp()

const server = app.listen(env.PORT, env.HOST, () => {
  logger.info(`Server listening on http://${env.HOST}:${env.PORT}`)
})

gracefulShutdown(server)