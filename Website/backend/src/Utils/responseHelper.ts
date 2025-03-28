import { Response, Request } from 'express';
export const sendResponse = (
    res: Response,
    success: boolean,
    status: number,
    message: string,
    data: any[] = [], // Ensure data is always an array
    error: any[] = [] // Ensure error is always an array
  ): void => {
    res.status(status).json({
      success,
      status,
      message,
      data: Array.isArray(data) ? data : [data], // Convert to array if not already
      error: Array.isArray(error) ? error : [error], // Convert to array if not already
    });
  };