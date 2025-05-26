/**
 * Custom error class for application-specific error handling
 *
 * Extends the standard Error class to provide structured error responses
 * with HTTP status codes, multiple messages, and normalized error details.
 * Implements the ApiResponse interface for consistent error formatting.
 */
import type { ApiResponse } from "@/interfaces/response.interface"
import { ensureArray } from "@/utils/helpers/helper-funtions"

/**
 * Custom error class that implements the ApiResponse interface
 *
 * Provides structured error handling with:
 * - HTTP status codes
 * - Multiple error messages
 * - Normalized error details
 * - Consistent response formatting
 */
export class CustomError extends Error implements ApiResponse {
  /** HTTP status code for the error response */
  public statusCode: number
  /** Array of human-readable error messages */
  public messages: string[]
  /** Empty data array (errors don't return data) */
  public data: []
  /** Normalized array of error details */
  public errors: any[]

  /**
   * Creates a new CustomError instance
   *
   * @param messages - Error message(s) - can be string or array of strings
   * @param statusCode - HTTP status code for the error
   * @param errors - Additional error details (optional)
   */
  constructor(messages: string | string[], statusCode: number, errors: any = []) {
    // Call parent Error constructor with concatenated messages
    super(typeof messages === "string" ? messages : messages.join(" <--> "))

    this.statusCode = statusCode
    this.messages = ensureArray(messages)
    this.data = []

    // Normalize errors into a consistent format
    this.errors = this.normalizeErrors(errors)

    // Maintain proper stack trace for debugging
    Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Normalizes various error formats into a consistent array of strings
   *
   * Handles different error types:
   * - Sequelize validation errors with nested error arrays
   * - String errors
   * - Array of mixed error types
   * - Generic objects (converted to JSON strings)
   *
   * @param errors - Raw error data in various formats
   * @returns Normalized array of error strings
   */
  private normalizeErrors(errors: any): any[] {
    if (!errors) {
      return []
    }

    // Handle Sequelize validation errors with nested structure
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

    // Fallback: convert any object to JSON string
    return [JSON.stringify(errors)]
  }

  /**
   * Converts the error to a standardized API response format
   *
   * @returns ApiResponse object ready for HTTP response
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
