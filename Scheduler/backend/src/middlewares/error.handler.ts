/**
 * Global error handling middleware for Express application
 *
 * Catches all errors thrown in route handlers and middleware,
 * formats them consistently, and sends appropriate HTTP responses.
 * Handles both custom application errors and unexpected system errors.
 */
import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import type { Request, Response, NextFunction } from "express"

/**
 * Express error handling middleware
 *
 * Processes errors and sends formatted responses to clients.
 * Custom errors are handled with their specific status codes and messages,
 * while unexpected errors default to 500 Internal Server Error.
 *
 * @param err - Error object (CustomError or generic Error)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const errorHandler = (err: Error | CustomError, req: Request, res: Response, next: NextFunction) => {
  // Handle custom application errors with specific formatting
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.toResponse())
  }

  // Handle unexpected system errors with generic 500 response
  res.status(500).json({
    statusCode: 500,
    messages: ["Internal Server Error"],
    data: null,
    errors: err.message || null,
  })
}
