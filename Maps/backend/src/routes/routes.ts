import express from "express"
import mapsRouter from "@modules/maps/maps.routes"
import latestMapsRouter from "@modules/latest-maps/latest-maps.routes"
import authRouter from "@/modules/auth/auth.routes"

const router = express.Router()

router.use("/auth", authRouter)
router.use('/maps', mapsRouter)
router.use('/latestMaps', latestMapsRouter)

export default router