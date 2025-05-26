/**
 * Main API Routes Configuration
 * Combines all module routes under the /api prefix
 */

import express from "express"
import mapsRouter from "@modules/maps/maps.routes"
import latestMapsRouter from "@modules/latest-maps/latest-maps.routes"
import authRouter from "@/modules/auth/auth.routes"

const router = express.Router()

// Mount module routes
router.use("/auth", authRouter) // Authentication endpoints
router.use("/maps", mapsRouter) // Map management endpoints
router.use("/latestMaps", latestMapsRouter) // Latest map tracking endpoints

export default router
