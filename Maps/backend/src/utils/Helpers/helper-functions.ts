/**
 * Helper Utility Functions
 * Contains various utility functions for file processing, validation,
 * and data transformation
 */

import { parseStringPromise } from "xml2js"
import { CustomError } from "../Response & Error Handling/custom-error"
import sharp from "sharp"

// Supported image file extensions
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

// All allowed file extensions for upload
export const allowedExtensions: Set<string> = new Set([".tmx", ".json", ".tsx", ".ts"].concat(allowedImageExtensions))

/**
 * Sanitize file path and validate extension
 */
export const sanitizePath = (path: string): string => {
  // remove everything before the last '/'
  const fileName = path.substring(path.lastIndexOf("/") + 1)

  // Validate the file extension
  const extension = fileName.substring(fileName.lastIndexOf("."))
  if (!allowedExtensions.has(extension.toLowerCase())) {
    throw new CustomError(`Invalid file extension: ${extension}`, 400)
  }

  return fileName
}

/**
 * Ensure data is in array format
 */
export const ensureArray = (data: any) => {
  return Array.isArray(data) ? data : [data]
}

/**
 * Convert XML buffer to JSON object
 */
export const convertXmlBufferToJson = async (buffer: Buffer): Promise<any> => {
  try {
    const xmlString = buffer.toString()

    // Parse XML string to JSON
    const jsonObject = await parseStringPromise(xmlString)

    return jsonObject
  } catch (err: any) {
    throw new CustomError("Error converting XML to JSON", 400)
  }
}

/**
 * Convert buffer containing JSON string to object
 */
export const convertBufferToJson = (buffer: Buffer): any => {
  try {
    // Convert buffer to string
    const jsonString = buffer.toString()

    // Parse the string into a JSON object
    const jsonObject = JSON.parse(jsonString)

    return jsonObject
  } catch (err: any) {
    throw new CustomError("Invalid JSON data in buffer", 400)
  }
}

/**
 * Convert JSON object to buffer
 */
export const convertJsonToBuffer = (jsonObject: any): Buffer => {
  try {
    // Convert JSON object to string
    const jsonString = JSON.stringify(jsonObject)

    // Convert string to buffer
    const buffer = Buffer.from(jsonString, "utf-8")

    return buffer
  } catch (err: any) {
    throw new CustomError("Error converting JSON to buffer", 400)
  }
}

/**
 * Convert any image format to PNG using Sharp
 */
export const convertImageToPng = async (inputBuffer: Buffer): Promise<Buffer> => {
  return await sharp(inputBuffer).png().toBuffer()
}
