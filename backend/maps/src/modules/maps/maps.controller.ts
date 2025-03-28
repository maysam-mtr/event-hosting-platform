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
import { getLatestMapByIdService, getLatestMapByOriginalMapIdService } from "../latest-maps/latest-maps.service"
import { CustomError } from "@/utils/custom-error"

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

    res.status(200).json({ message: "Maps fetched:", data: response })
  } catch (err: any) {
    next(err)
  }
}

const getMapByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getMapByIdService(id, "")
    res.status(200).json({ message: "Map fetched:", data: response })
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
    res.status(201).json({ message: "Map created:", data: response })
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
    res.status(200).json({ message: "Map updated:", data: response })
  } catch (err: any) {
    next(err)
  }
}

const deleteMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    await deleteMapService(id, "")
    res.status(200).json({ message: "Map deleted" })
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

