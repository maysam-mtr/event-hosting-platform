import type { NextFunction, Request, Response } from "express"
import { uploadFilesToDrive } from "./uploads.service"

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

    const result = await uploadFilesToDrive(req.files, mapName)

    res.status(200).json({
      message: "Files uploaded successfully",
      data: result,
    })
  } catch (err: any) {
    next(err)
  }
}

