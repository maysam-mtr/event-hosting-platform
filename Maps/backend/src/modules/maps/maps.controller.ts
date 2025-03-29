import type { NextFunction, Request, Response } from "express"
import {
  createMapService,
  deleteMapService,
  getMapByIdService,
  getMapsService,
  updateMapService,
  downloadMapService,
} from "./maps.service"
import { uploadFilesToDrive } from "../uploads/uploads.service"
import { getLatestMapByOriginalMapIdService } from "../latest-maps/latest-maps.service"
import { CustomError } from "@/utils/custom-error"
import { CustomResponse } from "@/utils/custom-response"
import { handleMapFiles } from "@/utils/maps-handler"

const getMapsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // const authorization = req.headers.authorization

    // if (!authorization) {
    //     res.status(404).json({ message: "No maps found"})
    //     return
    // }

    // const accessToken = authorization.split(' ')[1]
    // const response = await getMapsService(accessToken)

    const response = await getMapsService("")

    CustomResponse(res, 200, "Maps fetched", response)
  } catch (err: any) {
    next(err)
  }
}

const getMapByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getMapByIdService(id, "")

    CustomResponse(res, 200, "Map fetched", response)
  } catch (err: any) {
    next(err)
  }
}

// Add download map controller
const downloadMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const zipBuffer = await downloadMapService(id, "")

    // Set headers for file download
    res.setHeader("Content-Type", "application/zip")
    res.setHeader("Content-Disposition", `attachment; filename="map-${id}.zip"`)

    // Send the zip file
    res.send(zipBuffer)
  } catch (err: any) {
    next(err)
  }
}

// Update the createMapController to handle the thumbnail file
const createMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Handle file uploads first if files are present
    let folderId = req.body.folderId
    let imageId = req.body.imageId
    if (req.files && Object.keys(req.files).length > 0) {
      // if any file is missing an error would be thrown
      handleMapFiles(req.files)
      const uploadResult = await uploadFilesToDrive(req.files, req.body.name)
      folderId = uploadResult.folderId
      imageId = uploadResult.imageId || imageId
    }

    // Create map with the folder and image IDs
    const mapData = {
      ...req.body,
      folderId,
      imageId,
    }

    const response = await createMapService(mapData, "")

    CustomResponse(res, 200, "Map created", response)
  } catch (err: any) {
    next(err)
  }
}

// Update the updateMapController to handle the thumbnail file
const updateMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    console.log(`here with id: ${id}`)
    
    const latestMapByOriginalMapId = await getLatestMapByOriginalMapIdService(req.body.original_map_id)
    console.log("latest:", latestMapByOriginalMapId);
    
    if (latestMapByOriginalMapId?.latest_map_id !== id) {
      throw new CustomError("Please update the latest map", 404)
    }
    
    // Handle file uploads first if files are present
    let folderId = req.body.folderId
    let imageId = req.body.imageId

    if (req.files && Object.keys(req.files).length > 0) {
      // if any file is missing an error would be thrown
      handleMapFiles(req.files)
      const uploadResult = await uploadFilesToDrive(req.files, req.body.name)
      folderId = uploadResult.folderId
      // Only update imageId if a new thumbnail was uploaded
      if (uploadResult.imageId) {
        imageId = uploadResult.imageId
      }
    }

    // Update map with the folder and image IDs
    const mapData = {
      ...req.body,
      folderId,
      imageId,
    }

    const response = await updateMapService(id, mapData, "")

    CustomResponse(res, 200, "Map updated", response)
  } catch (err: any) {
    next(err)
  }
}

const deleteMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await deleteMapService(id, "")

    CustomResponse(res, 200, "Map deleted", response)
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
}

