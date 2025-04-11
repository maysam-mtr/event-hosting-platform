export interface MapResponse {
  images: Object[],
  rawData: Object
}

export interface CustomResponse<T = any> {
  statusCode: number;
  messages: string | string[];
  data: T | null;
  errors: any | null;
}