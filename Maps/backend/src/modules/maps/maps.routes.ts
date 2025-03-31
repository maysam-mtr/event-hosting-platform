import express from "express"
import {
  getMapsController,
  getMapByIdController,
  createMapController,
  updateMapController,
  deleteMapController,
  downloadMapController,
  getMapBoothsController,
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

mapsRouter.get("/getMaps", getMapsController)
mapsRouter.get("/getMap/:id", getMapByIdController)
mapsRouter.post("/createMap", createMapController)
mapsRouter.put("/updateMap/:id", updateMapController)
mapsRouter.delete("/deleteMap/:id", deleteMapController)
mapsRouter.get("/getMapBooths/:id", getMapBoothsController)
mapsRouter.get("/downloadMap/:id", downloadMapController)

export default mapsRouter

