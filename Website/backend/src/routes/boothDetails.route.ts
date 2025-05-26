import express from "express"
import {
  getBoothsForPartnerController,
  filterBoothsByStatusController,
  getBoothTemplateIdForPartnerAndEventController,
} from "../controllers/boothDetails.controller"
import { authenticateUser } from "../middleware/authentication"

/**
 * Booth Details Routes
 *
 * Handles all routes related to booth management and partner booth assignments.
 * Partners can view their assigned booths, filter by event status, and retrieve
 * specific booth template information.
 */
const router = express.Router()

// Retrieve all booths assigned to a specific partner
// Requires user authentication to ensure partner access
router.get("/partners/:partnerId", authenticateUser, getBoothsForPartnerController)

// Filter partner's booths by event status (past, ongoing, future)
// Helps partners organize their booth participation by time
router.get("/partners/:partnerId/filter", authenticateUser, filterBoothsByStatusController)

// Get the booth template ID for a specific partner in a specific event
// Used to identify which booth design/template the partner is using
router.get("/partners/:eventId/:partnerId", getBoothTemplateIdForPartnerAndEventController)

export default router
