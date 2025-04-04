export interface ApiResponse<T = any> {
  statusCode: number
  messages: string[]
  data: T | null
  errors: any | null
}