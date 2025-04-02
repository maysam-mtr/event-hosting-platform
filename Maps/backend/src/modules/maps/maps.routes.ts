import express from "express"
import {
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
mapsRouter.get("/downloadMap/:id", downloadMapController)

// Game-engine
mapsRouter.get("/getDetailedMap/:id", getDetailedMapByIdController)
mapsRouter.get("/getMapBooths/:id", getMapBoothsController)
mapsRouter.get("/getMapCollisions/:id", getMapCollisionsController)
mapsRouter.get("/getMapLayers/:id", getMapLayersController)

// Website
mapsRouter.get("/getMapBoothsDisplay/:id", getMapBoothsDisplayController)

export default mapsRouter

