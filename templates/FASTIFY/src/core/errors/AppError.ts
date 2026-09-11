export interface AppErrorOptions {
  message: string
  statusCode: number
  code: string
  details?: unknown
  isOperational?: boolean
  cause?: unknown
}

export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: unknown
  public readonly isOperational: boolean

  constructor(options: AppErrorOptions) {
    super(options.message)
    this.name = new.target.name
    this.statusCode = options.statusCode
    this.code = options.code
    this.details = options.details
    this.isOperational = options.isOperational ?? true
    if (options.cause !== undefined) {
      this.cause = options.cause
    }
    Error.captureStackTrace?.(this, new.target)
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super({ message, statusCode: 400, code: "BAD_REQUEST", details })
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, details?: unknown) {
    super({ message, statusCode: 401, code: "UNAUTHORIZED", details })
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, details?: unknown) {
    super({ message, statusCode: 403, code: "FORBIDDEN", details })
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super({ message, statusCode: 404, code: "NOT_FOUND", details })
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super({ message, statusCode: 409, code: "CONFLICT", details })
  }
}