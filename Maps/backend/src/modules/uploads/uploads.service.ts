import { createFolder, uploadFile } from "@/utils/google-drive"
import { CustomError } from "@/utils/custom-error"
import { Readable } from "stream"
import type { FileArray, UploadedFile } from "express-fileupload"
import { GOOGLE_MAPS_FOLDER_ID } from "@/config"
import { fileTypes, thumbnailFileType } from "@/utils/maps-handler"


interface UploadResult {
  folderId: string
  imageId: string | null
  files: {
    name: string
    id: string
    type: string
  }[]
}

// Update the uploadFilesToDrive function to handle the thumbnail separately
export const uploadFilesToDrive = async (files: FileArray, mapName: string): Promise<UploadResult> => {
  try {
    // Create a new folder for this map
    const sanitizedMapName = mapName.replace(/[^a-zA-Z0-9-_]/g, "_")
    const folderName = `${sanitizedMapName}_${Date.now()}`
    
    const folder = await createFolder(folderName, GOOGLE_MAPS_FOLDER_ID)

    if (!folder.id) {
      throw new CustomError("Failed to create folder in Google Drive", 500)
    }

    const folderId = folder.id
    let imageId: string | null = null
    const uploadedFiles = []

    // Handle thumbnail first if it exists
    if (files.thumbnailFile) {
      const thumbnailFile = Array.isArray(files.thumbnailFile) ? files.thumbnailFile[0] : files.thumbnailFile

      const uploadedThumbnail = await uploadSingleFile(thumbnailFile, folderId)
      imageId = uploadedThumbnail.id as string

      uploadedFiles.push({
        name: thumbnailFile.name,
        id: uploadedThumbnail.id as string,
        type: thumbnailFileType,
      })
    }

    // Process each file type
    for (const fileType of fileTypes) {
      const fileList = files[fileType]

      if (!fileList) continue

      // Handle both single file and array of files
      const filesToProcess = Array.isArray(fileList) ? fileList : [fileList]

      for (const file of filesToProcess) {
        const uploadedFile = await uploadSingleFile(file, folderId)

        uploadedFiles.push({
          name: file.name,
          id: uploadedFile.id as string,
          type: fileType,
        })
      }
    }

    return {
      folderId,
      imageId,
      files: uploadedFiles,
    }
  } catch (err: any) {
    console.error("Error uploading files to Google Drive:", err)
    throw new CustomError(err.message || "Failed to upload files", 500)
  }
}

const uploadSingleFile = async (file: UploadedFile, folderId: string) => {
  // Convert buffer to readable stream
  const fileStream = Readable.from(file.data)

  // Upload file to Google Drive
  const uploadedFile = await uploadFile(file.name, fileStream, folderId)

  if (!uploadedFile.id) {
    throw new CustomError(`Failed to upload file: ${file.name}`, 500)
  }

  return uploadedFile
}

