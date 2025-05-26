/**
 * Global Error Handler Middleware
 * Catches and formats all application errors into consistent API responses
 */

import type { Request, Response, NextFunction } from "express"
import { CustomError } from "../utils/Response & Error Handling/custom-error"

// Global error handling middleware
export const errorHandler = (err: Error | CustomError, req: Request, res: Response, next: NextFunction) => {
  // Handle custom application errors with structured response
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.toResponse())
  }

  // Handle unexpected errors with generic 500 response
  res.status(500).json({
    statusCode: 500,
    messages: ["Internal Server Error"],
    data: null,
    errors: err.message || null,
  })
}
