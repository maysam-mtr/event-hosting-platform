/**
 * Standard API response interface used throughout the application
 *
 * Provides a consistent structure for all API responses, including
 * success and error cases. This ensures uniform response formatting
 * across all endpoints.
 *
 * @template T - Type of the data payload (optional, defaults to any)
 */
export interface ApiResponse<T = any> {
  /** HTTP status code of the response */
  statusCode: number
  /** Array of human-readable messages describing the response */
  messages: string[]
  /** Response payload data, null if no data to return */
  data: T | null
  /** Error details if the response indicates an error, null otherwise */
  errors: any | null
}
