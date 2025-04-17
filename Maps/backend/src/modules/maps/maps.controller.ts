import type { NextFunction, Request, Response } from "express"
import {
  createMapService,
  deleteMapService,
  getMapByIdService,
  getMapsService,
  updateMapService,
  downloadMapService,
  getMapBoothsService,
  getMapDataByIdService,
  getMapCollisionsService,
  getMapLayersService,
  getspawnLocationService,
  getRawMapService,
  getMapTilesetsService,
} from "./maps.service"
import { uploadFilesToDrive } from "../../utils/files-upload.handler"
import { getLatestMapByOriginalMapIdService } from "../latest-maps/latest-maps.service"
import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import { CustomResponse } from "@/utils/Response & Error Handling/custom-response"
import { Booth } from "@/interfaces/map-layers.interface"
import { getFile, listFolderContent } from "@/utils/google-drive"
import { updateMapThumbnailFileName } from "@/utils/supabase"

const getMapsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await getMapsService()

    CustomResponse(res, 200, "Maps fetched", response)
  } catch (err: any) {
    next(err)
  }
}

const getMapByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getMapByIdService(id)

    CustomResponse(res, 200, "Map fetched", response)
  } catch (err: any) {
    next(err)
  }
}

const getDetailedMapByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getMapDataByIdService(id)
    
    CustomResponse(res, 200, "Map fetched", response)
  } catch (err: any) {
    next(err)
  }
}

const getRawMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    
    const response = await getRawMapService(id)

    res.status(200).json(response.rawData)
    
    // CustomResponse(res, 200, "Raw Map Data fetched", response)
  } catch (err: any) {
    next(err)
  }
}

const downloadMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const zipBuffer = await downloadMapService(id)

    // Set headers for file download
    res.setHeader("Content-Type", "application/zip")
    res.setHeader("Content-Disposition", `attachment; filename="map-${id}.zip"`)

    // Send the zip file
    res.send(zipBuffer)
  } catch (err: any) {
    next(err)
  }
}

const createMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Handle file uploads first if files are present
    let folderId, imageId
    
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadResult = await uploadFilesToDrive(req.files, req.body.name)
      
      folderId = uploadResult.folderId
      imageId = uploadResult.imageId
    }

    // Create map with the folder and image IDs
    const mapData = {
      ...req.body,
      folderId,
      imageId,
    }

    const response = await createMapService(mapData)

    updateMapThumbnailFileName(imageId as string, response.imageId as string)

    CustomResponse(res, 200, "Map created", response)
  } catch (err: any) {
    next(err)
  }
}

const updateMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    
    const latestMapByOriginalMapId = await getLatestMapByOriginalMapIdService(req.body.original_map_id)
    
    if (latestMapByOriginalMapId?.latest_map_id !== id) {
      throw new CustomError("Please update the latest map", 404)
    }
    
    // Handle file uploads first if files are present
    let folderId, imageId

    if (req.files && Object.keys(req.files).length > 0) {
      const uploadResult = await uploadFilesToDrive(req.files, req.body.name)
      folderId = uploadResult.folderId
      imageId = uploadResult.imageId
    }

    // Update map with the folder and image IDs
    const mapData = {
      ...req.body,
      folderId,
      imageId,
    }

    const response = await updateMapService(id, mapData)

    updateMapThumbnailFileName(imageId as string, response.imageId as string)

    CustomResponse(res, 200, "Map updated", response)
  } catch (err: any) {
    next(err)
  }
}

const deleteMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await deleteMapService(id)

    CustomResponse(res, 200, "Map deleted", response)
  } catch (err: any) {
    next(err)
  }
}

const getMapBoothsController = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const { id } = req.params

    const response = await getMapBoothsService(id)

    CustomResponse(res, 200, "Map booths successfully retrieved", response)
  } catch (err: any) {
    next(err)
  }
}

const getMapCollisionsController = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const { id } = req.params

    const response = await getMapCollisionsService(id)

    CustomResponse(res, 200, "Map collisions successfully retrieved", response)
  } catch (err: any) {
    next(err)
  }
}

const getMapLayersController = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const { id } = req.params

    const response = await getMapLayersService(id)

    CustomResponse(res, 200, "Map layers successfully retrieved", response)
  } catch (err: any) {
    next(err)
  }
}

const getspawnLocationController = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const { id } = req.params

    const response = await getspawnLocationService(id)

    CustomResponse(res, 200, "Map spawn location successfully retrieved", response)
  } catch (err: any) {
    next(err)
  }
}

const getMapBoothsDisplayController = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const { id } = req.params

    const fullResponse = await getMapBoothsService(id)

    const response = fullResponse.map((booth: Booth) => ({
      id: booth.id,
      x: booth.x,
      y: booth.y,
      width: booth.width,
      height: booth.height,
    }))

    CustomResponse(res, 200, "Map booths successfully retrieved", response)
  } catch (err: any) {
    next(err)
  }
}

const loadMapDataForGameEngineController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    
    const response = await getRawMapService(id)
    const tilesets = await getMapTilesetsService(id)

    const images: { image: string, name: string, data: string }[] = []

    const files = await listFolderContent(response.map.folderId)
    for(const file of files) {
      const image = file.name
      if (image) {
        const tileset = tilesets.find(ts => ts.image === image)
        if (tileset) {
          const lastperiod = image.lastIndexOf('.')
          if (lastperiod !== -1) {
            const type = image.substring(lastperiod + 1)
            if (type === "png") {
              const { data } = await getFile(file.id as string)
              
              // Converting the Buffer to a Base64 string
              const base64Image = data.toString("base64")
              
              images.push({ image, name: tileset.name , data: base64Image })
            }
          }
        }
      }
    }
    
    CustomResponse(res, 200, "Raw Map Data fetched", {
      images,
      rawData: response.rawData
    })
  } catch (err: any) {
    next(err)
  }
}

export {
  getMapsController,
  getMapByIdController,
  createMapController,
  updateMapController,
  deleteMapController,
  downloadMapController,
  getMapBoothsController,
  getMapBoothsDisplayController,
  getDetailedMapByIdController,
  getMapCollisionsController,
  getMapLayersController,
  getspawnLocationController,
  getRawMapController,
  loadMapDataForGameEngineController,
}

