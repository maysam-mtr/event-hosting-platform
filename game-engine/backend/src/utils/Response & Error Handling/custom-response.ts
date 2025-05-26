/**
 * Custom Response Formatting Utility
 *
 * This module provides a standardized way to format HTTP responses across all API endpoints.
 * It ensures consistent response structure with proper status codes, messages, data, and error handling.
 *
 * The CustomResponse function creates uniform API responses that match the ApiResponse interface,
 * making it easier for frontend applications to handle responses consistently.
 */

import type { Response } from "express"
import type { ApiResponse } from "../interfaces"

/**
 * Creates a standardized HTTP response with consistent structure
 * @param res - Express Response object
 * @param statusCode - HTTP status code for the response
 * @param messages - Success or informational message(s)
 * @param data - Response data payload (optional)
 * @param errors - Error information (optional)
 */
export function CustomResponse<T>(
  res: Response,
  statusCode: number,
  messages: string | string[],
  data: T | null = null,
  errors: any | null = null,
) {
  // Ensure messages is always an array for consistency
  if (typeof messages === "string") messages = [messages]

  // Create standardized response object
  const response: ApiResponse<T> = { statusCode, messages, data, errors }

  // Send response with appropriate HTTP status code
  res.status(statusCode).json(response)
}
