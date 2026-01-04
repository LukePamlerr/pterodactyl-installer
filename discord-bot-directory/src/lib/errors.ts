export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean
  public details?: any

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, details?: any) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.details = details

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  public details: any

  constructor(message: string, details?: any) {
    super(message, 400)
    this.details = details
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500)
  }
}

export class DiscordAPIError extends AppError {
  constructor(message: string = 'Discord API error') {
    super(message, 502)
  }
}

export function handleApiError(error: any): {
  statusCode: number
  message: string
  details?: any
} {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    }
  }

  // Handle Prisma errors
  if (error.code === 'P2002') {
    return {
      statusCode: 409,
      message: 'Resource already exists',
      details: error.meta,
    }
  }

  if (error.code === 'P2025') {
    return {
      statusCode: 404,
      message: 'Resource not found',
      details: error.meta,
    }
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return {
      statusCode: 400,
      message: 'Validation failed',
      details: error.details,
    }
  }

  // Log unexpected errors
  console.error('Unexpected error:', error)

  return {
    statusCode: 500,
    message: 'Internal server error',
  }
}

export function createErrorResponse(error: any) {
  const { statusCode, message, details } = handleApiError(error)
  
  return Response.json(
    {
      error: message,
      ...(details && { details }),
    },
    { status: statusCode }
  )
}

export function asyncHandler<T>(
  fn: (...args: any[]) => Promise<T>
) {
  return (...args: any[]) => {
    return Promise.resolve(fn(...args)).catch(error => {
      throw createErrorResponse(error)
    })
  }
}
