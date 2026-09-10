import Fastify from "fastify"
import helmet from "@fastify/helmet"
import cors from "@fastify/cors"
import compress from "@fastify/compress"
import cookie from "@fastify/cookie"
import rateLimit from "@fastify/rate-limit"
import { env } from "./config/env"
import { loggerOptions } from "./config/logger"
import { errorHandler } from "./config/error-handler"
import { registerRoutes } from "./http/routes"

export function buildApp() {
  const app = Fastify({ logger: loggerOptions })

  app.register(helmet)
  app.register(cors, {
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(","),
    credentials: true,
  })
  app.register(compress)
  app.register(cookie)
  app.register(rateLimit, { max: 100, timeWindow: "1 minute" })

  app.setErrorHandler(errorHandler)

  registerRoutes(app)

  return app
}