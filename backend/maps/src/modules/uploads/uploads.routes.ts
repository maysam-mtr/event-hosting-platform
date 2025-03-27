import express from "express"
import { uploadFilesController } from "./uploads.controller"
import fileUpload from "express-fileupload"

const uploadsRouter = express.Router()

// Middleware to handle file uploads
uploadsRouter.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    abortOnLimit: true,
    createParentPath: true,
  }),
)

uploadsRouter.post("/uploadFiles", uploadFilesController)

export default uploadsRouter

