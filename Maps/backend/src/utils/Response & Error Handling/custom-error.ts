/**
 * Custom Error Class
 * Provides structured error handling with consistent API response format
 */

import { ensureArray } from "../Helpers/helper-functions"
import type { ApiResponse } from "../../interfaces/response.interface"

export class CustomError extends Error implements ApiResponse {
  public statusCode: number
  public messages: string[]
  public data: []
  public errors: any[]

  constructor(messages: string | string[], statusCode: number, errors: any = []) {
    super(typeof messages === "string" ? messages : messages.join(" <--> "))
    this.statusCode = statusCode
    this.messages = ensureArray(messages)
    this.data = []

    // Normalize errors into an array of strings
    this.errors = this.normalizeErrors(errors)

    Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Normalize various error formats into consistent array structure
   */
  private normalizeErrors(errors: any): any[] {
    if (!errors) {
      return []
    }

    // Handle Sequelize validation errors
    if (errors.errors && Array.isArray(errors.errors)) {
      return errors.errors.map((err: any) => err.message)
    }

    // Handle string errors
    if (typeof errors === "string") {
      return [errors]
    }

    // Handle array of errors
    if (Array.isArray(errors)) {
      return errors.map((err) => (typeof err === "string" ? err : JSON.stringify(err)))
    }

    // Fallback: Converting error object to a string
    return [JSON.stringify(errors)]
  }

  /**
   * Convert error to API response format
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
