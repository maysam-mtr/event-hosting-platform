import express from "express"
import {
  getLatestMapByIdController,
  getLatestMapsController,
  getLatestMapsWithDetailsController,
} from "./latest-maps.controller"

const latestMapsRouter = express.Router()

latestMapsRouter.get("/getLatestMaps", getLatestMapsController)
latestMapsRouter.get("/getLatestMap/:id", getLatestMapByIdController)
latestMapsRouter.get("/getLatestMapsWithDetails", getLatestMapsWithDetailsController)

export default latestMapsRouter

