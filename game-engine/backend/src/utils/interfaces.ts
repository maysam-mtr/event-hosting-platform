export interface Image {
    image: string
    name: string
    data: string
}

export interface MapResponse {
    images: Image[],
    rawData: Object
}

export interface Player {
    id: string, 
    position: { x: number, y: number }
}

export interface MapsApiResponse<T = any> {
  statusCode: number
  messages: string[]
  data: T | null
  errors: any | null
}

export interface WebsiteApiResponse {
  success: boolean
  status: number
  message: string
  data: []
  error: []
}