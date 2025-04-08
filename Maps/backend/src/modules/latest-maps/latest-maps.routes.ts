import express from "express"
import {
  getLatestMapByIdController,
  getLatestMapsController,
  getLatestMapsWithDetailsController,
  getLatestMapsDisplayController,
} from "./latest-maps.controller"
import { adminAuthMiddleware, adminAndHostAuthMiddleware } from "@/middlewares/auth.middleware"

const latestMapsRouter = express.Router()

latestMapsRouter.get("/getLatestMaps", adminAuthMiddleware, getLatestMapsController)
latestMapsRouter.get("/getLatestMap/:id", adminAuthMiddleware, getLatestMapByIdController)
latestMapsRouter.get("/getLatestMapsWithDetails", adminAuthMiddleware, getLatestMapsWithDetailsController)

// Website
latestMapsRouter.get("/getLatestMapsDisplay", adminAndHostAuthMiddleware, getLatestMapsDisplayController)

export default latestMapsRouter

