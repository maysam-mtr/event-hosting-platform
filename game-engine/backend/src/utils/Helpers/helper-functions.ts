/**
 * Utility Helper Functions
 *
 * This module provides common utility functions used throughout the application:
 * - File validation and sanitization for security
 * - Data type normalization and conversion
 * - Buffer and JSON conversion utilities
 *
 * These functions ensure data integrity and security when handling file uploads
 * and data transformations.
 */

import { CustomError } from "../Response & Error Handling/custom-error"

// Allowed file extensions for image uploads and map files
export const allowedImageExtensions = [
  ".png",
  ".jpeg",
  ".jpg",
  ".webp",
  ".tiff",
  ".gif",
  ".svg",
  ".avif",
  ".heif",
  ".raw",
]
export const allowedExtensions: Set<string> = new Set([".tmx", ".json", ".tsx", ".ts"].concat(allowedImageExtensions))

/**
 * Sanitizes file paths and validates file extensions for security
 * @param path - File path to sanitize
 * @returns Sanitized filename with validated extension
 * @throws CustomError if file extension is not allowed
 */
export const sanitizePath = (path: string): string => {
  // Extract filename from path
  const fileName = path.substring(path.lastIndexOf("/") + 1)

  // Validate file extension against allowed types
  const extension = fileName.substring(fileName.lastIndexOf("."))
  if (!allowedExtensions.has(extension.toLowerCase())) {
    throw new CustomError(`Invalid file extension: ${extension}`, 400)
  }

  return fileName
}

/**
 * Ensures data is returned as an array, converting single items to arrays
 * @param data - Data that may be a single item or array
 * @returns Array containing the data
 */
export const ensureArray = (data: any) => {
  return Array.isArray(data) ? data : [data]
}

/**
 * Converts Buffer data to JSON object with error handling
 * @param buffer - Buffer containing JSON data
 * @returns Parsed JSON object
 * @throws CustomError if buffer contains invalid JSON
 */
export const convertBufferToJson = (buffer: Buffer): any => {
  try {
    const jsonString = buffer.toString()
    const jsonObject = JSON.parse(jsonString)
    return jsonObject
  } catch (err: any) {
    throw new CustomError("Invalid JSON data in buffer", 400)
  }
}

/**
 * Converts JSON object to Buffer for storage or transmission
 * @param jsonObject - JSON object to convert
 * @returns Buffer containing JSON string data
 * @throws CustomError if conversion fails
 */
export const convertJsonToBuffer = (jsonObject: any): Buffer => {
  try {
    const jsonString = JSON.stringify(jsonObject)
    const buffer = Buffer.from(jsonString, "utf-8")
    return buffer
  } catch (err: any) {
    throw new CustomError("Error converting JSON to buffer", 400)
  }
}
