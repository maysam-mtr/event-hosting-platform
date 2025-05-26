/**
 * Custom Response Helper
 * Provides consistent API response formatting across all endpoints
 */

import type { Response } from "express"
import type { ApiResponse } from "../../interfaces/response.interface"

/**
 * Send standardized API response
 */
export function CustomResponse<T>(
  res: Response,
  statusCode: number,
  messages: string | string[],
  data: T | null = null,
  errors: any | null = null,
) {
  if (typeof messages === "string") messages = [messages]
  const response: ApiResponse<T> = { statusCode, messages, data, errors }
  res.status(statusCode).json(response)
}
