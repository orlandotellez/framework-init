import type { NextFunction, Request, Response } from "express"
import { ZodError, z } from "zod"
import { AppError } from "../core/errors/AppError.ts"
import { logger } from "./logger.ts"

function formatZodIssueMessage(issue: z.ZodIssue): string {
  const path = issue.path.length > 0 ? issue.path.join(".") : "value"
  return `${path}: ${issue.message}`
}

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof SyntaxError && "status" in error && (error as { status?: number }).status === 400) {
    return response.status(400).json({ code: "BAD_REQUEST", message: "Invalid JSON body" })
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0]
    const message = firstIssue ? formatZodIssueMessage(firstIssue) : "Invalid request"
    return response.status(400).json({ code: "BAD_REQUEST", message })
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      code: error.code,
      message: error.message,
      ...(error.details !== undefined ? { details: error.details } : {}),
    })
  }

  logger.error({ err: error, method: _request.method, url: _request.url }, "Unhandled error")
  return response.status(500).json({ code: "INTERNAL_ERROR", message: "Internal server error" })
}