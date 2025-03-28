import type { NextFunction, Request, Response } from "express"
import {
  createLatestMapService,
  deleteLatestMapService,
  getLatestMapByIdService,
  getLatestMapsService,
  getLatestMapsWithDetailsService,
  updateLatestMapService,
} from "./latest-maps.service"

const getLatestMapsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await getLatestMapsService("")

    res.status(200).json({ message: "Latest maps fetched:", data: response })
  } catch (err: any) {
    next(err)
  }
}

const getLatestMapsWithDetailsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await getLatestMapsWithDetailsService("")

    res.status(200).json({ message: "Latest maps with details fetched:", data: response })
  } catch (err: any) {
    next(err)
  }
}

const getLatestMapByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const response = await getLatestMapByIdService(id, "")
    res.status(200).json({ message: "Latest map fetched:", data: response })
  } catch (err: any) {
    next(err)
  }
}

const createLatestMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const mapData = req.body
    const response = await createLatestMapService(mapData, "")
    res.status(201).json({ message: "Latest map created:", data: response })
  } catch (err: any) {
    next(err)
  }
}

const updateLatestMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const mapData = req.body
    const response = await updateLatestMapService(id, mapData, "")
    res.status(200).json({ message: "Latest map updated:", data: response })
  } catch (err: any) {
    next(err)
  }
}

const deleteLatestMapController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    await deleteLatestMapService(id, "")
    res.status(200).json({ message: "Latest map deleted" })
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

