import { parseStringPromise } from "xml2js"
import { CustomError } from "../Response & Error Handling/custom-error"
import sharp from "sharp"

export const allowedImageExtensions = ['.png', '.jpeg', '.jpg', '.webp', '.tiff', '.gif', '.svg', '.avif', '.heif', '.raw']
export const allowedExtensions: Set<string> = new Set(['.tmx', '.json', '.tsx', '.ts'].concat(allowedImageExtensions))

export const sanitizePath = (path: string): string => {
  // remove everything before the last '/'
  const fileName = path.substring(path.lastIndexOf('/') + 1)

  // Validate the file extension
  const extension = fileName.substring(fileName.lastIndexOf('.'))
  if (!allowedExtensions.has(extension.toLowerCase())) {
    throw new CustomError(`Invalid file extension: ${extension}`, 400)
  }

  return fileName
}

export const ensureArray = (data: any) => {
  return Array.isArray(data) ? data : [data]
}

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

export const convertImageToPng = async (inputBuffer: Buffer): Promise<Buffer> => {
  return await sharp(inputBuffer)
    .png()
    .toBuffer()
}