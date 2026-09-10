import pino from "pino"
import { env } from "./env.ts"

export const loggerOptions = {
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport: env.NODE_ENV === "production" ? undefined : { target: "pino-pretty", options: { colorize: true } },
}

export const logger = pino(loggerOptions)