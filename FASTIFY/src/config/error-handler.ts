import type { FastifyError, FastifyReply, FastifyRequest } from "fastify"
import { ZodError, z } from "zod"
import { AppError } from "@/core/errors/AppError"
import { logger } from "./logger"

function formatZodIssueMessage(issue: z.ZodIssue): string {
  const path = issue.path.length > 0 ? issue.path.join(".") : "value"
  return `${path}: ${issue.message}`
}

export function errorHandler(error: FastifyError | AppError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    const firstIssue = error.issues[0]
    const message = firstIssue ? formatZodIssueMessage(firstIssue) : "Invalid request"
    return reply.status(400).send({ code: "BAD_REQUEST", message })
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      code: error.code,
      message: error.message,
      ...(error.details !== undefined ? { details: error.details } : {}),
    })
  }

  logger.error({ err: error, method: request.method, url: request.url }, "Unhandled error")
  return reply.status(500).send({ code: "INTERNAL_ERROR", message: "Internal server error" })
}