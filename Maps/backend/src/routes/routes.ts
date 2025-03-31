import express from "express"
import mapsRouter from "@modules/maps/maps.routes"
import latestMapsRouter from "@modules/latest-maps/latest-maps.routes"

const router = express.Router()

router.use('/maps', mapsRouter)
router.use('/latestMaps', latestMapsRouter)

export default router