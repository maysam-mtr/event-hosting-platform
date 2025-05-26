/**
 * Custom response utility for standardized API responses
 *
 * Provides a consistent way to format and send HTTP responses
 * throughout the application. Ensures all responses follow
 * the same structure defined by the ApiResponse interface.
 */
import type { ApiResponse } from "@/interfaces/response.interface"
import type { Response } from "express"

/**
 * Sends a standardized API response
 *
 * Creates and sends a consistent response format for all endpoints.
 * Automatically converts single messages to arrays and applies
 * the appropriate HTTP status code.
 *
 * @template T - Type of the response data payload
 * @param res - Express response object
 * @param statusCode - HTTP status code for the response
 * @param messages - Success/info message(s) - string or array of strings
 * @param data - Response payload data (optional, defaults to null)
 * @param errors - Error details (optional, defaults to null)
 */
export function CustomResponse<T>(
  res: Response,
  statusCode: number,
  messages: string | string[],
  data: T | null = null,
  errors: any | null = null,
) {
  // Normalize messages to array format
  if (typeof messages === "string") messages = [messages]

  // Create standardized response object
  const response: ApiResponse<T> = { statusCode, messages, data, errors }

  // Send response with appropriate status code
  res.status(statusCode).json(response)
}
