import express from "express"
import { getPrivateEventCredentialController } from "../controllers/credential.controller"
import { authenticateHost } from "../middleware/authentication"

/**
 * Event Credential Routes
 *
 * Manages access credentials for private events.
 * Only hosts can retrieve credentials for their own private events.
 */
const router = express.Router()

// Retrieve the passcode/credential for a private event
// Restricted to authenticated hosts who own the event
router.get("/:eventId", authenticateHost, getPrivateEventCredentialController)

export default router
