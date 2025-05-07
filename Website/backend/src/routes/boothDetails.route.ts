import express from "express";
import { getBoothsForPartnerController, filterBoothsByStatusController, getBoothTemplateIdForPartnerAndEventController } from "../controllers/boothDetails.controller";
import { authenticateUser } from "../middleware/authentication";

const router = express.Router();

// Get all booths for a specific partner
router.get("/partners/:partnerId",authenticateUser, getBoothsForPartnerController);

// Filter booths by status (past, ongoing, future)
router.get("/partners/:partnerId/filter", authenticateUser, filterBoothsByStatusController);
router.get("/partners/:eventId/:partnerId",getBoothTemplateIdForPartnerAndEventController);
export default router;