export interface Map {
  id: string
  original_map_id: string | null
  name: string
  folderId: string
  imageId: string
  created_at?: string
  updated_at?: string
}

export interface CustomResponse<T = any> {
  statusCode: number
  messages: string | string[]
  data: T | null
  errors: any | null
}