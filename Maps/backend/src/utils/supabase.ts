import crypto from 'crypto'
import { UploadedFile } from 'express-fileupload'
import supabase from '@/config/supabase.config'
import { CustomError } from './Response & Error Handling/custom-error'
import { BUCKET_NAME } from '@/config'

export const uploadMapThumbnail = async (file: UploadedFile): Promise<{ id: string, path: string, fullPath: string } | null> => {
  try {
    const fileId = crypto.randomUUID()
    const ext = file.name.split('.').pop()
    const fileName = `${fileId}.${ext}`

    const { data, error } = await supabase
      .storage
      .from(BUCKET_NAME as string)
      .upload(fileName, file.data, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.mimetype,
      })

    if (error) {
      throw error
    }

    return data
  } catch (err: any) {
    throw new CustomError('Error uploading map thumbnail', 400, err)
  }
}

export const updateMapThumbnailFileName = async (tempFileName: string, originalFileName: string): Promise<void> => {
  try {
    const copyRes = await supabase.storage
    .from(BUCKET_NAME as string)
    .copy(tempFileName, originalFileName)

    if (copyRes.error) {
      throw copyRes.error
    }

    const deleteRes = await supabase
    .storage
    .from(BUCKET_NAME as string)
    .remove([tempFileName])
    
    if (deleteRes.error) {
      throw deleteRes.error
    }

  } catch (err: any) {
    throw new CustomError('Error updating map thumbnail file name', 400, err)
  }
}

export const downloadMapThumbnail = async (fileName: string): Promise<Buffer> => {
  try {
    const { data, error } = await supabase
    .storage
    .from(BUCKET_NAME as string)
    .download(fileName)

    if (error) {
      throw error
    }

    const arrayBuffer = await data.arrayBuffer()

    return Buffer.from(arrayBuffer)

  } catch (err: any) {
    throw new CustomError("Error downloading map thumbnail", 400, err)
  }
}

export const deleteMapThumbnail = async (fileName: string) : Promise<void> => {
  try {
    const { data, error } = await supabase
    .storage
    .from(BUCKET_NAME as string)
    .remove([fileName])
    
    if (error) {
      throw error
    }

  } catch (err: any) {
    throw new CustomError("Error deleting map thumbnail", 400, err)
  }
}