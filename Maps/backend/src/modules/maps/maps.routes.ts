/**
 * Maps Routes
 * Defines API endpoints for map operations with file upload support and role-based access
 */

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

// File upload middleware configuration
mapsRouter.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    abortOnLimit: true,
    createParentPath: true,
  }),
)

// Admin-only endpoints (map management)
mapsRouter.get("/getMaps", roleAuthMiddleware([]), getMapsController)
mapsRouter.post("/createMap", roleAuthMiddleware([]), createMapController)
mapsRouter.put("/updateMap/:id", roleAuthMiddleware([]), updateMapController)
mapsRouter.delete("/deleteMap/:id", roleAuthMiddleware([]), deleteMapController)
mapsRouter.get("/downloadMap/:id", roleAuthMiddleware([]), downloadMapController)

// Game engine endpoints (public for game integration)
mapsRouter.get("/loadMapData/:id", loadMapDataForGameEngineController)

// Host access endpoints (for website integration)
mapsRouter.get("/getMap/:id", roleAuthMiddleware([Roles.HOST]), getMapByIdController)
mapsRouter.get("/getMapBoothsDisplay/:id", getMapBoothsDisplayController) // Public for game engine

// Helper endpoints for map component extraction
mapsRouter.get("/getDetailedMap/:id", roleAuthMiddleware([Roles.HOST]), getDetailedMapByIdController)
mapsRouter.get("/getMapBooths/:id", roleAuthMiddleware([Roles.HOST]), getMapBoothsController)
mapsRouter.get("/getMapCollisions/:id", roleAuthMiddleware([Roles.HOST]), getMapCollisionsController)
mapsRouter.get("/getMapLayers/:id", roleAuthMiddleware([Roles.HOST]), getMapLayersController)
mapsRouter.get("/getSpawnLocation/:id", roleAuthMiddleware([Roles.HOST]), getspawnLocationController)
mapsRouter.get("/getRawMap/:id", getRawMapController)

export default mapsRouter
