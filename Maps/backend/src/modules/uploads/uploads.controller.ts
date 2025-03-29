import type { NextFunction, Request, Response } from "express"
import { uploadFilesToDrive } from "./uploads.service"
import { CustomResponse } from "@/utils/custom-response"

export const uploadFilesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.files) {
      res.status(400).json({ message: "No files uploaded" })
      return
    }

    const { mapName } = req.body

    if (!mapName) {
      res.status(400).json({ message: "Map name is required" })
      return
    }

    const response = await uploadFilesToDrive(req.files, mapName)


    CustomResponse(res, 200, "Files uploaded successfully", response)
  } catch (err: any) {
    next(err)
  }
}

