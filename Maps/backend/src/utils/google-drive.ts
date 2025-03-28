import drive from "@/config/google-drive.config"
import type { drive_v3 } from "googleapis"
import fs from "fs"
import path from "path"
import type { Readable } from "stream"
import mime from "mime-types"

const createFolder = async (folderName: string, parentId?: string): Promise<drive_v3.Schema$File> => {
  try {
    const fileMetaData: drive_v3.Schema$File = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      ...(parentId && { parents: [parentId] }),
    }

    console.log("here all good?");
    
    const res = await drive.files.create({
      requestBody: fileMetaData,
      fields: "id,name,webViewLink",
    })

    console.log("creating folder res: ", res);
    

    return res.data
  } catch (err: any) {
    console.error("Error creating folder:", err.message)
    throw err
  }
}

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
    console.error("Error uploading file:", err.message)
    throw err
  }
}

const addReadPermission = async (fileId: string): Promise<void> => {
  try {
    const res = await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    })
    console.log("Permission created:", res.data)
  } catch (err: any) {
    console.error("Error creating permission:", err)
    throw err
  }
}

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
    console.error("Error generating public URL:", err.message)
    throw err
  }
}

// Update getFile to return the file data
// const getFile = async (fileId: string, returnData = false): Promise<drive_v3.Schema$File | { data: Buffer } | void> => {
const getFile = async (fileId: string, returnData = false): Promise<{ data: Buffer } | void> => {
  try {
    const res = await drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      { responseType: "arraybuffer" },
    )

    if (returnData) {
      return { data: Buffer.from(res.data as ArrayBuffer) } // Ensure correct typing
    }

    const dest = fs.createWriteStream(path.join(__dirname, `../public/retrievedFile`))
    const buffer = Buffer.from(res.data as ArrayBuffer)
    dest.write(buffer)
    dest.end()

    return new Promise((resolve, reject) => {
      dest.on("finish", () => resolve(undefined))
      dest.on("error", reject)
    })
  } catch (err: any) {
    console.error("error:", err.message)
    throw err
  }
}

const getFolder = async (fileId: string) => {
  try {
    const res = await drive.files.get({
      fileId: fileId,
    })
    console.log("folder:", res.data)
    return res.data
  } catch (err: any) {
    console.error("error:", err.message)
    throw err
  }
}

const listFolderContent = async (folderId: string): Promise<drive_v3.Schema$File[]> => {
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, name, mimeType, webViewLink, webContentLink)",
    })

    return res.data.files || []
  } catch (err: any) {
    console.error("Error listing folder content:", err.message)
    throw err
  }
}

const trashFileOrFolder = async (fileOrFolderId: string): Promise<drive_v3.Schema$File | undefined> => {
  try {
    const body_value = {
      trashed: true,
    }
    const res = await drive.files.update({
      fileId: fileOrFolderId,
      requestBody: body_value,
    })
    console.log({ result: res.data, status: res.status })
    return res.data
  } catch (err: any) {
    console.error("error:", err.message)
    throw err
  }
}

const permanentlyDeleteFile = async (fileOrFolderId: string) => {
  try {
    const res = await drive.files.delete({
      fileId: fileOrFolderId,
    })
    console.log({ result: res.data, status: res.status })
  } catch (err: any) {
    console.error("error:", err.message)
  }
}

// Add a function to get a direct download URL for images
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
}

