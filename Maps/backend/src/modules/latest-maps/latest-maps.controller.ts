import type { NextFunction, Request, Response } from "express"
import {
  createLatestMapService,
  deleteLatestMapService,
  getLatestMapByIdService,
  getLatestMapsService,
  getLatestMapsWithDetailsService,
  updateLatestMapService,
} from "./latest-maps.service"
import { CustomResponse } from "@/utils/custom-response"

const getLatestMapsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await getLatestMapsService("")

    CustomResponse(res, 200, "Latest maps fectched", response)
  } catch (err: any) {
    next(err)
  }
}

const getLatestMapsWithDetailsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await getLatestMapsWithDetailsService("")
    
    CustomResponse(res, 200, "Latest maps with details fetched:", response)
  } catch (err: any) {
    next(err)
  }
}

const getLatestMapByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getLatestMapByIdService(id, "")

    CustomResponse(res, 200, "Latest map fectched", response)
  } catch (err: any) {
    next(err)
  }
}

const createLatestMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const mapData = req.body
    const response = await createLatestMapService(mapData, "")

    CustomResponse(res, 200, "Latest map created", response)
  } catch (err: any) {
    next(err)
  }
}

const updateLatestMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const mapData = req.body
    const response = await updateLatestMapService(id, mapData, "")
    
    CustomResponse(res, 200, "Latest map updated", response)
  } catch (err: any) {
    next(err)
  }
}

const deleteLatestMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await deleteLatestMapService(id, "")

    CustomResponse(res, 200, "Latest map deleted", response)
  } catch (err: any) {
    next(err)
  }
}

export {
  getLatestMapsController,
  getLatestMapsWithDetailsController,
  getLatestMapByIdController,
  createLatestMapController,
  updateLatestMapController,
  deleteLatestMapController,
}

