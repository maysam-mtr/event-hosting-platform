import express from "express"
import {
  createLatestMapController,
  deleteLatestMapController,
  getLatestMapByIdController,
  getLatestMapsController,
  getLatestMapsWithDetailsController,
  updateLatestMapController,
} from "./latest-maps.controller"

const latestMapsRouter = express.Router()

// latestMapsRouter.get('/getLatestMaps', authMiddleware, getlatestMapsController)
latestMapsRouter.get("/getLatestMaps", getLatestMapsController)
latestMapsRouter.get("/getLatestMapsWithDetails", getLatestMapsWithDetailsController)
latestMapsRouter.get("/getLatestMap/:id", getLatestMapByIdController)
latestMapsRouter.post("/createLatestMap", createLatestMapController)
latestMapsRouter.put("/updateLatestMap/:id", updateLatestMapController)
latestMapsRouter.delete("/deleteLatestMap/:id", deleteLatestMapController)

export default latestMapsRouter

