/**
 * Latest Maps Controller
 * Handles HTTP requests for latest map operations and provides different views
 * for admin interface and display purposes
 */

import type { NextFunction, Request, Response } from "express"
import { getLatestMapByIdService, getLatestMapsService, getLatestMapsWithDetailsService } from "./latest-maps.service"
import { CustomResponse } from "@/utils/Response & Error Handling/custom-response"

/**
 * Get all latest maps (basic data)
 * Returns raw latest map records
 */
const getLatestMapsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await getLatestMapsService()
    CustomResponse(res, 200, "Latest maps fectched", response)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Get latest maps with detailed information for display
 * Includes map details and booth count for each latest map
 */
const getLatestMapsDisplayController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const fullResponse = await getLatestMapsWithDetailsService()

    // Filter response to include only necessary display data
    const response = fullResponse.map((map) => ({
      id: map.id,
      name: map.name,
      imageId: map.imageId,
      created_at: map.created_at,
      updated_at: map.updated_at,
      booths: map.booths,
    }))

    CustomResponse(res, 200, "Latest maps with details fetched:", response)
  } catch (err: any) {
    next(err)
  }
}

/**
 * Get specific latest map by ID
 */
const getLatestMapByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getLatestMapByIdService(id)
    CustomResponse(res, 200, "Latest map fectched", response)
  } catch (err: any) {
    next(err)
  }
}

export { getLatestMapsController, getLatestMapByIdController, getLatestMapsDisplayController }
