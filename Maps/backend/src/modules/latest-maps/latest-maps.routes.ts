import express from "express"
import {
  getLatestMapByIdController,
  getLatestMapsController,
  getLatestMapsDisplayController,
} from "./latest-maps.controller"
import { roleAuthMiddleware } from "@/middlewares/auth.middleware"
import { Roles } from "@/middlewares/roles"

const latestMapsRouter = express.Router()

// Maps -> Admin
latestMapsRouter.get("/getLatestMaps", roleAuthMiddleware([]), getLatestMapsController)
latestMapsRouter.get("/getLatestMap/:id", roleAuthMiddleware([]), getLatestMapByIdController)


// Website -> Host
latestMapsRouter.get("/getLatestMapsDisplay", roleAuthMiddleware([Roles.HOST]), getLatestMapsDisplayController)

export default latestMapsRouter

