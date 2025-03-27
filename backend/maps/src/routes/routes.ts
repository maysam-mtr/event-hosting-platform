import express, { Router } from "express"
// import authRouter from "@modules/auth/auth.routes"
import mapsRouter from "@modules/maps/maps.routes"
import latestMapsRouter from "@modules/latest-maps/latest-maps.routes"
import uploadsRouter from "@/modules/uploads/uploads.routes"

const router = express.Router()

// router.use('/auth', authRouter)
router.use('/maps', mapsRouter)
router.use('/latestMaps', latestMapsRouter)
router.use("/uploads", uploadsRouter)

export default router