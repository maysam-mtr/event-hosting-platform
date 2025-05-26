/**
 * Latest Maps Routes
 * Defines API endpoints for latest map operations with role-based access control
 */

import express from "express"
import {
  getLatestMapByIdController,
  getLatestMapsController,
  getLatestMapsDisplayController,
} from "./latest-maps.controller"
import { roleAuthMiddleware } from "@/middlewares/auth.middleware"
import { Roles } from "@/middlewares/roles"

const latestMapsRouter = express.Router()

// Admin-only endpoints (empty array means only admin access)
latestMapsRouter.get("/getLatestMaps", roleAuthMiddleware([]), getLatestMapsController)
latestMapsRouter.get("/getLatestMap/:id", roleAuthMiddleware([]), getLatestMapByIdController)

// Host access endpoints (for website integration)
latestMapsRouter.get("/getLatestMapsDisplay", roleAuthMiddleware([Roles.HOST]), getLatestMapsDisplayController)

export default latestMapsRouter
