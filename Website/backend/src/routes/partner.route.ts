import express from "express"
import { getPartnerByIdController, updatePartnerController } from "../controllers/partner.controller"
import { updatePartnerValidation } from "../validation/partner.validator"
import { authenticateUser } from "../middleware/authentication"

/**
 * Partner Management Routes
 *
 * Handles partner profile management and information updates.
 * Partners can update their company information, contact details, and branding.
 */
const router = express.Router()

// Update partner profile information
// Validates partner data and requires user authentication
router.put("/update/:partnerId", authenticateUser, updatePartnerValidation(), updatePartnerController)

// Retrieve partner information by ID
// Public endpoint for accessing partner details
router.get("/:id", getPartnerByIdController)

export default router
