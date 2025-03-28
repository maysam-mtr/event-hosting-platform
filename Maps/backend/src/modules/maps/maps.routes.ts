import express from "express"
import {
  getMapsController,
  getMapByIdController,
  createMapController,
  updateMapController,
  deleteMapController,
  downloadMapController,
} from "./maps.controller"
import fileUpload from "express-fileupload"

const mapsRouter = express.Router()

// Add file upload middleware
mapsRouter.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    abortOnLimit: true,
    createParentPath: true,
  }),
)

// mapsRouter.get('/getMaps', authMiddleware, getMapsController)
mapsRouter.get("/getMaps", getMapsController)
mapsRouter.get("/getMap/:id", getMapByIdController)
mapsRouter.get("/downloadMap/:id", downloadMapController)
mapsRouter.post("/createMap", createMapController)
mapsRouter.put("/updateMap/:id", updateMapController)
mapsRouter.delete("/deleteMap/:id", deleteMapController)

export default mapsRouter

