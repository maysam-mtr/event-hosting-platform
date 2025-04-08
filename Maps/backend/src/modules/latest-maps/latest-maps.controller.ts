import type { NextFunction, Request, Response } from "express"
import {
  getLatestMapByIdService,
  getLatestMapsService,
  getLatestMapsWithDetailsService,
} from "./latest-maps.service"
import { CustomResponse } from "@/utils/Response & Error Handling/custom-response"
import { Map } from "@/interfaces/map.interface"

const getLatestMapsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await getLatestMapsService()

    CustomResponse(res, 200, "Latest maps fectched", response)
  } catch (err: any) {
    next(err)
  }
}

const getLatestMapsWithDetailsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await getLatestMapsWithDetailsService()
    
    CustomResponse(res, 200, "Latest maps with details fetched:", response)
  } catch (err: any) {
    next(err)
  }
}
const getLatestMapsDisplayController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const fullResponse = await getLatestMapsWithDetailsService()
    const response = fullResponse.map((map: Map) => ({
      id: map.id,
      name: map.name,
      imageId: map.imageId,
      updated_at: map.updated_at,
    }))
    
    CustomResponse(res, 200, "Latest maps with details fetched:", response)
  } catch (err: any) {
    next(err)
  }
}

const getLatestMapByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getLatestMapByIdService(id)

    CustomResponse(res, 200, "Latest map fectched", response)
  } catch (err: any) {
    next(err)
  }
}

export {
  getLatestMapsController,
  getLatestMapsWithDetailsController,
  getLatestMapByIdController,
  getLatestMapsDisplayController,
}

