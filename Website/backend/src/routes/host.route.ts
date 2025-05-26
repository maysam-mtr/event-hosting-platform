import express from "express"
import { updateHostController } from "../controllers/host.controller"
import { updateHostValidation } from "../validation/host.validator"
import { authenticateHost } from "../middleware/authentication"

/**
 * Host Management Routes
 *
 * Handles host profile management and account updates.
 * Provides endpoints for hosts to modify their account information.
 */
const router = express.Router()

// Update host profile information
// Validates input data and requires host authentication
router.put("/update", authenticateHost, updateHostValidation(), updateHostController)

export default router
