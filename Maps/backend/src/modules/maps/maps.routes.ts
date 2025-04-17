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
  loadMapDataForGameEngineController,
} from "./maps.controller"
import fileUpload from "express-fileupload"
import { roleAuthMiddleware } from "@/middlewares/auth.middleware"
import { Roles } from "@/middlewares/roles"

const mapsRouter = express.Router()

// Add file upload middleware
mapsRouter.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    abortOnLimit: true,
    createParentPath: true,
  }),
)


// Maps -> Admin
mapsRouter.get("/getMaps", roleAuthMiddleware([]), getMapsController)
mapsRouter.post("/createMap", roleAuthMiddleware([]), createMapController)
mapsRouter.put("/updateMap/:id", roleAuthMiddleware([]), updateMapController)
mapsRouter.delete("/deleteMap/:id", roleAuthMiddleware([]), deleteMapController)
mapsRouter.get("/downloadMap/:id", roleAuthMiddleware([]), downloadMapController)


// Game-engine
mapsRouter.get("/loadMapData/:id", loadMapDataForGameEngineController)


// Website -> Host
mapsRouter.get("/getMap/:id", roleAuthMiddleware([Roles.HOST]), getMapByIdController)
mapsRouter.get("/getMapBoothsDisplay/:id", roleAuthMiddleware([Roles.HOST]), getMapBoothsDisplayController)


// Helper Endpoints
mapsRouter.get("/getDetailedMap/:id", roleAuthMiddleware([Roles.HOST]), getDetailedMapByIdController)
mapsRouter.get("/getMapBooths/:id", roleAuthMiddleware([Roles.HOST]), getMapBoothsController)
mapsRouter.get("/getMapCollisions/:id", roleAuthMiddleware([Roles.HOST]), getMapCollisionsController)
mapsRouter.get("/getMapLayers/:id", roleAuthMiddleware([Roles.HOST]), getMapLayersController)
mapsRouter.get("/getSpawnLocation/:id", roleAuthMiddleware([Roles.HOST]), getspawnLocationController)
mapsRouter.get("/getRawMap/:id", getRawMapController)

export default mapsRouter

