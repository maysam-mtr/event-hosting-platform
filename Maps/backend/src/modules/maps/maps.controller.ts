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
} from "./maps.service"
import { uploadFilesToDrive } from "../../utils/files-upload.handler"
import { getLatestMapByOriginalMapIdService } from "../latest-maps/latest-maps.service"
import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import { CustomResponse } from "@/utils/Response & Error Handling/custom-response"

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

const getMapBoothsDisplayController = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const { id } = req.params

    const fullResponse = await getMapBoothsService(id)

    const response = fullResponse.map((booth: any) => ({
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
}

