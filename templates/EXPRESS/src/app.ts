import express from "express"
import helmet from "helmet"
import cors from "cors"
import compression from "compression"
import cookieParser from "cookie-parser"
import { rateLimit } from "express-rate-limit"
import { pinoHttp } from "pino-http"
import { env } from "./config/env.ts"
import { logger } from "./config/logger.ts"
import { errorHandler } from "./config/error-handler.ts"
import { registerRoutes } from "./http/routes.ts"

export function buildApp() {
  const app = express()

  app.disable("x-powered-by")
  app.use(helmet())
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(","),
      credentials: true,
    })
  )
  app.use(compression())
  app.use(express.json())
  app.use(cookieParser())
  app.use(pinoHttp({ logger }))
  app.use(rateLimit({ windowMs: 60_000, limit: 100, legacyHeaders: false }))

  registerRoutes(app)

  app.use(errorHandler)

  return app
}