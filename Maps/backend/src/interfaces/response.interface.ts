/**
 * Standard API Response Interface
 * Ensures consistent response format across all API endpoints
 */

export interface ApiResponse<T = any> {
  statusCode: number // HTTP status code
  messages: string[] // Array of response messages
  data: T | null // Response data (generic type)
  errors: any | null // Error details if any
}
