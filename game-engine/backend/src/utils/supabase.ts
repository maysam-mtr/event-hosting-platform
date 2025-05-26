/**
 * Supabase Storage Operations
 *
 * This module handles file operations with Supabase storage:
 * - Downloads partner company logos from cloud storage
 * - Converts downloaded files to Buffer format for local storage
 * - Provides error handling for storage operations
 *
 * The module uses the configured Supabase client to interact with storage buckets
 * and ensures proper error handling for file download operations.
 */

import supabase from "../config/supabase.config"
import { CustomError } from "./Response & Error Handling/custom-error"

/**
 * Downloads a partner's company logo from Supabase storage
 * @param fileName - Name of the file to download from storage bucket
 * @returns Buffer containing the downloaded image data
 * @throws CustomError if download fails or file doesn't exist
 */
export const downloadPartnerCompanyLogo = async (fileName: string): Promise<Buffer> => {
  try {
    // Download file from Supabase storage bucket
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_PARTNERS_BUCKET_NAME || "eventure-imgs")
      .download(fileName)

    if (error) {
      console.error("err:", error)
      throw error
    }

    // Convert downloaded blob to ArrayBuffer then to Buffer
    const arrayBuffer = await data.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (err: any) {
    throw new CustomError("Error downloading map thumbnail", 400, err)
  }
}
