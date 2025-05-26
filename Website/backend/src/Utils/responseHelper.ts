/**
 * Response Helper Utility
 * 
 * Provides a standardized way to send HTTP responses across all API endpoints.
 * Ensures consistent response format with success status, message, data, and error fields.
 * All responses follow the same structure for easier frontend handling.
 */
import { Response, Request } from 'express';

/**
 * Sends a standardized HTTP response with consistent structure
 * @param res - Express response object
 * @param success - Boolean indicating if the operation was successful
 * @param status - HTTP status code (200, 400, 500, etc.)
 * @param message - Human-readable message describing the result
 * @param data - Response data (always converted to array format)
 * @param error - Error information (always converted to array format)
 */
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
