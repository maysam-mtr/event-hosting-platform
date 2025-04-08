import { createFolder, uploadFile } from "@/utils/google-drive"
import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import { Readable } from "stream"
import type { FileArray, UploadedFile } from "express-fileupload"
import { GOOGLE_MAPS_FOLDER_ID } from "@/config"
import { toLower } from "lodash"
import { convertJsonToBuffer, convertXmlBufferToJson, ensureArray, sanitizePath } from "./Helpers/helper-functions"
import { boothesClassName, fileTypes, FileTypes, thumbnailFileType } from "@/constants"
import { getRequiredFilesFromJSONFile } from "./maps.handler"

interface UploadResult {
  folderId: string
  imageId: string | null
  files: {
    name: string
    id: string
    type: string
  }[]
}

export const uploadFilesToDrive = async (files: FileArray,  mapName: string): Promise<UploadResult> => {
  try {
    // Validation first
    const missingFileTypes = verifyAllFileTypesArePresent(files)
    
    // if there is a missing file directly return an error
    if (missingFileTypes.length > 0) {
      throw new CustomError(missingFileTypes, 400)
    }

    // check for required resources the map needs
    const jsonFile = files[FileTypes.JsonFile] as UploadedFile
    const requiredFiles = getRequiredFilesFromJSONFile(jsonFile.data)
    
    const tilesetsUploaded = getUploadedFiles(files[FileTypes.TilesetFiles])

    const missingTilesets = checkMissingFiles(requiredFiles.tilesets, tilesetsUploaded)

    if (missingTilesets.length > 0) {
      throw new CustomError("Please upload all required map tileset files", 400, missingTilesets)
    }

    // here tilesets required would all be present, now make sure images for those tilesets are uploaded too
    // but before sanitize images path
    await fixTilesetImagesFilePath(files[FileTypes.TilesetFiles])
    const requiredTilesetImages = await getRequiredTilesetImagesAndFilePaths(files[FileTypes.TilesetFiles])

    const uploadedTilesetImages = getUploadedFiles(files[FileTypes.ImageFiles])
    
    const missingTilesetImages = checkMissingFiles(requiredTilesetImages, uploadedTilesetImages)

    if (missingTilesetImages.length > 0) {
      throw new CustomError("Please upload all required map tileset image files", 400, missingTilesets)
    }
    
    const templateFiles = ensureArray(files[FileTypes.TemplateFiles])
    
    const templatesUploaded = getUploadedFiles(templateFiles)
    
    const missingTemplates = checkMissingFiles(requiredFiles.templates, templatesUploaded)
    
    if (missingTemplates.length > 0) {
      throw new CustomError("Please upload all required map template files", 400, missingTemplates)
    }

    // Collect width and height for each template based on its name
    const templateDimensions: { name: string, width: number, height: number }[] = []

    for (const template of templateFiles) {
      const jsonData = await convertXmlBufferToJson(template.data)
      const width = parseInt(jsonData.template.object[0].$.width, 10)
      const height = parseInt(jsonData.template.object[0].$.height, 10)

      templateDimensions.push({
        name: template.name,
        width,
        height,
      })
    }

    const jsonFileData = JSON.parse(jsonFile.data.toString())

    for (const layer of jsonFileData.layers) {
      if (layer?.class && toLower(layer.class) === toLower(boothesClassName)) {
        if (layer.layers) {
          for (const subLayer of layer.layers) {
            if (subLayer.objects) {
              for (const obj of subLayer.objects) {
                if (obj.template) {
                  const templateDimension = templateDimensions.find(
                    (dim) => dim.name === obj.template
                  )
                  if (templateDimension) {
                    obj.width = templateDimension.width
                    obj.height = templateDimension.height
                  }
                }
              }
            }
          }
        }
      }
    }
    

    // Update the JSON file data with the modified structure
    if (Array.isArray(files[FileTypes.JsonFile])) {
      files[FileTypes.JsonFile][0].data = convertJsonToBuffer(jsonFileData)
    } else {
      files[FileTypes.JsonFile].data = convertJsonToBuffer(jsonFileData)
    }

    // Create a new folder for this map
    const sanitizedMapName = mapName.replace(/[^a-zA-Z0-9-_]/g, "_")
    const folderName = `${sanitizedMapName}_${Date.now()}`
    
    const folder = await createFolder(folderName, GOOGLE_MAPS_FOLDER_ID)

    if (!folder.id) {
      throw new CustomError("Failed to create folder in Google Drive", 400)
    }

    const folderId = folder.id
    let imageId: string | null = null
    const uploadedFiles = []

    // Handle thumbnail first
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
      const filesToProcess = ensureArray(fileList)

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
    throw new CustomError(err.message || "Failed to upload files", 400)
  }
}

const uploadSingleFile = async (file: UploadedFile, folderId: string) => {
  try {
    // Convert buffer to readable stream
    const fileStream = Readable.from(file.data)

    // Upload file to Google Drive
    const uploadedFile = await uploadFile(file.name, fileStream, folderId)

    if (!uploadedFile.id) {
      throw new CustomError(`Failed to upload file: ${file.name}`, 400)
    }

    return uploadedFile
  } catch (err: any) {
    throw new CustomError(`Error uploading file: ${file.name}`, 400)
  }
}

const fixTilesetImagesFilePath = async (tilesets: UploadedFile | UploadedFile[]) : Promise<void> => {
  try {
    tilesets = ensureArray(tilesets)

    for (const tileset of tilesets) {
      const jsonData = await convertXmlBufferToJson(tileset.data)
      const images = ensureArray(jsonData.tileset.image)
      for (const image of images) {
        image.$.image = sanitizePath(image.$.source)
      }
    }
  } catch (err: any) {
    throw new CustomError("Error fixing tileset image paths", 400)
  }
}

const getRequiredTilesetImagesAndFilePaths = async (tilesets: UploadedFile | UploadedFile[]) : Promise<Set<string>> => {
  try {
    // if not an array convert to one
    tilesets = ensureArray(tilesets)

    const requiredTilesetImages: Set<string> = new Set()

    for (const tileset of tilesets) {
      const jsonData = await convertXmlBufferToJson(tileset.data)
      const images = ensureArray(jsonData.tileset.image)
      for (const image of images) {
        requiredTilesetImages.add(image.$.source)
      }
    }

    return requiredTilesetImages
  } catch (err: any) {
    throw new CustomError("Error gathering required tileset image files", 400)
  }
  
}

const getUploadedFiles = (files : UploadedFile | UploadedFile[]) : Set<string> => {
    
  // if files is not an array place it in an array
  const filesUploaded = ensureArray(files)
  
  const fileNames: Set<string> = new Set()

  for(const file of filesUploaded) {
      fileNames.add(file.name)
  }

  return fileNames
}

const checkMissingFiles = (requiredTilesets: Set<string>, uploadedTilesets: Set<string>) : string[] => {
    
  if (requiredTilesets.size === 0) {
      return ["Required Tilesets is empty"]
  }
  
  const errors: string[] = []
  requiredTilesets.forEach((file: string) => {
      if (!uploadedTilesets.has(file)) {
          errors.push(`${file} is missing`)
      }
  })
  return errors
}

const verifyAllFileTypesArePresent = (files: FileArray): string[] => {
  const missingFiles: string[] = []
  
  if (!files[thumbnailFileType]) {
    missingFiles.push(`Please upload map thumbnail`)
  }

  for(const type of fileTypes) {
    if (!files[type]) {
      missingFiles.push(`Please upload the ${type}`)
    }
  }
  return missingFiles
}