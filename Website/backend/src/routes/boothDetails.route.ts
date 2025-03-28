import express from "express";
import { getBoothsForPartnerController, filterBoothsByStatusController } from "../controllers/boothDetails.controller";

const router = express.Router();

// Get all booths for a specific partner
router.get("/partners/:partnerId", getBoothsForPartnerController);

// Filter booths by status (past, ongoing, future)
router.get("/partners/:partnerId/filter", filterBoothsByStatusController);

export default router;