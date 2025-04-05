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
  getspawnLocationController,
  getRawMapController,
} from "./maps.controller"
import fileUpload from "express-fileupload"
import { adminAuthMiddleware, adminAndHostAuthMiddleware } from "@/middlewares/auth.middleware"

const mapsRouter = express.Router()

// Add file upload middleware
mapsRouter.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    abortOnLimit: true,
    createParentPath: true,
  }),
)

mapsRouter.get("/getMaps", adminAuthMiddleware, getMapsController)
mapsRouter.get("/getMap/:id", adminAuthMiddleware, getMapByIdController)
mapsRouter.post("/createMap", adminAuthMiddleware, createMapController)
mapsRouter.put("/updateMap/:id", adminAuthMiddleware, updateMapController)
mapsRouter.delete("/deleteMap/:id", adminAuthMiddleware, deleteMapController)
mapsRouter.get("/downloadMap/:id", adminAuthMiddleware, downloadMapController)

// Game-engine
mapsRouter.get("/getDetailedMap/:id", adminAndHostAuthMiddleware, getDetailedMapByIdController)
mapsRouter.get("/getMapBooths/:id", adminAndHostAuthMiddleware, getMapBoothsController)
mapsRouter.get("/getMapCollisions/:id", adminAndHostAuthMiddleware, getMapCollisionsController)
mapsRouter.get("/getMapLayers/:id", adminAndHostAuthMiddleware, getMapLayersController)
mapsRouter.get("/getSpawnLocation/:id", adminAndHostAuthMiddleware, getspawnLocationController)


mapsRouter.get("/getRawMap", getRawMapController)


// Website
mapsRouter.get("/getMapBoothsDisplay/:id", adminAndHostAuthMiddleware, getMapBoothsDisplayController)

export default mapsRouter

