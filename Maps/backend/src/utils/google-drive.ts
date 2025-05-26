/**
 * Google Drive Integration Utilities
 * Provides functions for file and folder operations using Google Drive API
 */

import drive from "@/config/google-drive.config"
import type { drive_v3 } from "googleapis"
import type { Readable } from "stream"
import mime from "mime-types"
import { CustomError } from "./Response & Error Handling/custom-error"

/**
 * Create a new folder in Google Drive
 */
const createFolder = async (folderName: string, parentId?: string): Promise<drive_v3.Schema$File> => {
  try {
    const fileMetaData: drive_v3.Schema$File = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      ...(parentId && { parents: [parentId] }),
    }

    const res = await drive.files.create({
      requestBody: fileMetaData,
      fields: "id,name,webViewLink",
    })

    return res.data
  } catch (err: any) {
    throw new CustomError("Error creating folder", 500)
  }
}

/**
 * Upload file to Google Drive with public read permissions
 */
const uploadFile = async (fileName: string, fileStream: Readable, parentId?: string): Promise<drive_v3.Schema$File> => {
  try {
    const mimeType = mime.lookup(fileName) || "application/octet-stream"

    const fileMetaData: drive_v3.Schema$File = {
      name: fileName,
      ...(parentId && { parents: [parentId] }),
    }

    const res = await drive.files.create({
      requestBody: fileMetaData,
      media: {
        mimeType,
        body: fileStream,
      },
      fields: "id,name,webViewLink,webContentLink",
    })

    const fileId = res.data.id as string

    await addReadPermission(fileId)

    return res.data
  } catch (err: any) {
    throw new CustomError("Error uploading file", 500)
  }
}

/**
 * Add public read permission to a file
 */
const addReadPermission = async (fileId: string): Promise<void> => {
  try {
    const res = await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    })
  } catch (err: any) {
    throw new CustomError("Error adding read permission to the file", 500)
  }
}

/**
 * Generate public URLs for a file
 */
const generatePublicURL = async (fileId: string): Promise<{ webViewLink?: string; webContentLink?: string }> => {
  try {
    const res = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    })

    return {
      webViewLink: res.data.webViewLink ?? undefined,
      webContentLink: res.data.webContentLink ?? undefined,
    }
  } catch (err: any) {
    throw new CustomError("Error generating public URL", 500)
  }
}

/**
 * Download file content as buffer
 */
const getFile = async (fileId: string): Promise<{ data: Buffer }> => {
  try {
    const res = await drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      { responseType: "arraybuffer" },
    )

    return { data: Buffer.from(res.data as ArrayBuffer) }
  } catch (err: any) {
    throw new CustomError("Error retrieving file", 500)
  }
}

/**
 * Get file by type from a specific folder
 */
const getFileByTypeFromFolder = async (folderId: string, type: string) => {
  try {
    const fileRes = await drive.files.list({
      q: `'${folderId}' in parents and name contains '.${type}'`,
      fields: "files(id)",
    })

    const files = fileRes.data.files

    if (!files || files.length === 0) {
      throw new CustomError("File not found", 400)
    }

    const fileId = files[0].id as string

    const res = await drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      { responseType: "arraybuffer" },
    )

    return { data: Buffer.from(res.data as ArrayBuffer) }
  } catch (err: any) {
    throw new CustomError("Error retrieving file", 500)
  }
}

/**
 * Get folder metadata
 */
const getFolder = async (fileId: string) => {
  try {
    const res = await drive.files.get({
      fileId: fileId,
    })
    return res.data
  } catch (err: any) {
    throw new CustomError("Error retrieving folder", 500)
  }
}

/**
 * List all files in a folder
 */
const listFolderContent = async (folderId: string): Promise<drive_v3.Schema$File[]> => {
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, name, mimeType, webViewLink, webContentLink)",
    })

    return res.data.files || []
  } catch (err: any) {
    throw new CustomError("Error listing folder content", 500)
  }
}

/**
 * Move file or folder to trash
 */
const trashFileOrFolder = async (fileOrFolderId: string): Promise<drive_v3.Schema$File | undefined> => {
  try {
    const body_value = {
      trashed: true,
    }
    const res = await drive.files.update({
      fileId: fileOrFolderId,
      requestBody: body_value,
    })
    return res.data
  } catch (err: any) {
    throw new CustomError("Error deleting file", 500)
  }
}

/**
 * Permanently delete file from Google Drive
 */
const permanentlyDeleteFile = async (fileOrFolderId: string) => {
  try {
    const res = await drive.files.delete({
      fileId: fileOrFolderId,
    })
    return res.data
  } catch (err: any) {
    throw new CustomError("Error permanently deleting file", 500)
  }
}

/**
 * Generate direct download URL for images
 */
const getDirectDownloadUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

export {
  createFolder,
  uploadFile,
  generatePublicURL,
  listFolderContent,
  getFile,
  getFolder,
  trashFileOrFolder,
  permanentlyDeleteFile,
  addReadPermission,
  getDirectDownloadUrl,
  getFileByTypeFromFolder,
}
