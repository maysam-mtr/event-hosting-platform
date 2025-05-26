/**
 * Maps Controller
 * Handles HTTP requests for map operations including CRUD operations,
 * file downloads, and component extraction for different client needs
 */

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
  getMapDimensionsService,
} from "./maps.service"
import { uploadFilesToDrive } from "../../utils/files-upload.handler"
import { getLatestMapByOriginalMapIdService } from "../latest-maps/latest-maps.service"
import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import { CustomResponse } from "@/utils/Response & Error Handling/custom-response"
import type { Booth } from "@/interfaces/map-layers.interface"
import { getFile, listFolderContent } from "@/utils/google-drive"
import { downloadMapThumbnail, updateMapThumbnailFileName } from "@/utils/supabase"
import sharp from "sharp"

/**
 * Get all maps
 */
const getMapsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await getMapsService()
    CustomResponse(res, 200, "Maps fetched", response)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Get map by ID (basic information)
 */
const getMapByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getMapByIdService(id)
    CustomResponse(res, 200, "Map fetched", response)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Get detailed map information including processed components
 */
const getDetailedMapByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getMapDataByIdService(id)
    CustomResponse(res, 200, "Map fetched", response)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Get raw map data (unprocessed JSON)
 * Returns raw Tiled map data without wrapper
 */
const getRawMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getRawMapService(id)
    // Return raw JSON directly without API wrapper
    res.status(200).json(response.rawData)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Download complete map as ZIP file
 */
const downloadMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const zipBuffer = await downloadMapService(id)

    // Set headers for file download
    res.setHeader("Content-Type", "application/zip")
    res.setHeader("Content-Disposition", `attachment; filename="map-${id}.zip"`)
    res.send(zipBuffer)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Create new map with file uploads
 */
const createMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let folderId, imageId

    // Handle file uploads if present
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadResult = await uploadFilesToDrive(req.files, req.body.name)
      folderId = uploadResult.folderId
      imageId = uploadResult.imageId
    }

    // Create map with file references
    const mapData = { ...req.body, folderId, imageId }
    const response = await createMapService(mapData)

    // Update thumbnail filename to match map ID
    updateMapThumbnailFileName(imageId as string, response.imageId as string)

    CustomResponse(res, 200, "Map created", response)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Update existing map
 * Ensures only latest map versions can be updated
 */
const updateMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params

    // Verify this is the latest version of the map
    const latestMapByOriginalMapId = await getLatestMapByOriginalMapIdService(req.body.original_map_id)

    if (latestMapByOriginalMapId?.latest_map_id !== id) {
      throw new CustomError("Please update the latest map", 404)
    }

    let folderId, imageId

    // Handle file uploads if present
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadResult = await uploadFilesToDrive(req.files, req.body.name)
      folderId = uploadResult.folderId
      imageId = uploadResult.imageId
    }

    const mapData = { ...req.body, folderId, imageId }
    const response = await updateMapService(id, mapData)

    // Update thumbnail filename
    updateMapThumbnailFileName(imageId as string, response.imageId as string)

    CustomResponse(res, 200, "Map updated", response)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Delete map and associated files
 */
const deleteMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await deleteMapService(id)
    CustomResponse(res, 200, "Map deleted", response)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Get booth objects from map
 */
const getMapBoothsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getMapBoothsService(id)
    CustomResponse(res, 200, "Map booths successfully retrieved", response)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Get collision data from map
 */
const getMapCollisionsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getMapCollisionsService(id)
    CustomResponse(res, 200, "Map collisions successfully retrieved", response)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Get tile layers from map
 */
const getMapLayersController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getMapLayersService(id)
    CustomResponse(res, 200, "Map layers successfully retrieved", response)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Get spawn location from map
 */
const getspawnLocationController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getspawnLocationService(id)
    CustomResponse(res, 200, "Map spawn location successfully retrieved", response)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Get booth display data with image dimensions and booth positions
 * Used for visual booth placement interfaces
 */
const getMapBoothsDisplayController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params

    const fullResponse = await getMapBoothsService(id)
    const mapDimensions = await getMapDimensionsService(id)

    // Get thumbnail image dimensions
    const buffer = await downloadMapThumbnail(`${id}.png`)
    const image = sharp(buffer)
    const metadata = await image.metadata()

    if (!metadata.width || !metadata.height) {
      throw new CustomError("Error extracting image dimensions", 400)
    }

    // Format booth data for display
    const booths = fullResponse.map((booth: Booth) => ({
      id: booth.id,
      x: booth.x,
      y: booth.y,
      width: booth.width,
      height: booth.height,
    }))

    CustomResponse(res, 200, "Map booths successfully retrieved", {
      image: {
        width: metadata.width,
        height: metadata.height,
      },
      map: {
        ...mapDimensions,
      },
      booths,
    })
  } catch (err: any) {
    next(err)
  }
}

/**
 * Load complete map data for game engine
 * Includes tileset images as base64 and raw map data
 */
const loadMapDataForGameEngineController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params

    const response = await getRawMapService(id)
    const tilesets = await getMapTilesetsService(id)

    const images: { image: string; name: string; data: string }[] = []

    // Get all tileset images as base64
    const files = await listFolderContent(response.map.folderId)
    for (const file of files) {
      const image = file.name
      if (image) {
        const tileset = tilesets.find((ts) => ts.image === image)
        if (tileset) {
          const lastperiod = image.lastIndexOf(".")
          if (lastperiod !== -1) {
            const type = image.substring(lastperiod + 1)
            if (type === "png") {
              const { data } = await getFile(file.id as string)

              // Convert buffer to base64 for game engine
              const base64Image = data.toString("base64")
              images.push({ image, name: tileset.name, data: base64Image })
            }
          }
        }
      }
    }

    CustomResponse(res, 200, "Raw Map Data fetched", {
      images,
      rawData: response.rawData,
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
