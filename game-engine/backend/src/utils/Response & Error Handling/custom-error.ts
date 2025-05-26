/**
 * Custom Error Handling Class
 *
 * This module provides a standardized error handling system that:
 * - Extends the native Error class with additional properties
 * - Normalizes error messages and validation errors into consistent format
 * - Provides structured error responses for API endpoints
 * - Handles various error types including Sequelize validation errors
 *
 * The CustomError class ensures all errors are properly formatted and
 * contain relevant information for debugging and user feedback.
 */

import { ensureArray } from "../Helpers/helper-functions"
import type { ApiResponse } from "../interfaces"

export class CustomError extends Error implements ApiResponse {
  public statusCode: number // HTTP status code for the error
  public messages: string[] // Array of error messages
  public data: [] // Empty data array for consistency
  public errors: any[] // Detailed error information

  /**
   * Creates a new CustomError instance
   * @param messages - Error message(s) to display
   * @param statusCode - HTTP status code for the error
   * @param errors - Additional error details or validation errors
   */
  constructor(messages: string | string[], statusCode: number, errors: any = []) {
    super(typeof messages === "string" ? messages : messages.join(" <--> "))
    this.statusCode = statusCode
    this.messages = ensureArray(messages)
    this.data = []

    // Process and normalize error details
    this.errors = this.normalizeErrors(errors)

    // Maintain proper stack trace for debugging
    Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Normalizes various error formats into a consistent array structure
   * @param errors - Raw error data from various sources
   * @returns Normalized array of error messages
   */
  private normalizeErrors(errors: any): any[] {
    if (!errors) {
      return []
    }

    // Handle Sequelize validation errors with nested error arrays
    if (errors.errors && Array.isArray(errors.errors)) {
      return errors.errors.map((err: any) => err.message)
    }

    // Handle simple string errors
    if (typeof errors === "string") {
      return [errors]
    }

    // Handle arrays of mixed error types
    if (Array.isArray(errors)) {
      return errors.map((err) => (typeof err === "string" ? err : JSON.stringify(err)))
    }

    // Convert complex error objects to JSON strings
    return [JSON.stringify(errors)]
  }

  /**
   * Converts the error instance to a standardized API response format
   * @returns Formatted API response object
   */
  toResponse(): ApiResponse {
    return {
      statusCode: this.statusCode,
      messages: this.messages,
      data: this.data,
      errors: this.errors,
    }
  }
}
