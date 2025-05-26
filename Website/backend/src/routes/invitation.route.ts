import { Router } from "express"
import {
  createInvitationController,
  handleSharableLinkController,
  handleAcceptedInvitationController,
  handleRejectedInvitationController,
  getInvitationsForEventController,
  deleteInvitationByIdController,
  handleAcceptedInvitationForNewPartnerController,
} from "../controllers/invitation.controller"
import { authenticateUser } from "../middleware/authentication"
import { createInvitationValidation } from "../validation/invitation.validator"
import { createPartnerValidation } from "../validation/partner.validator"

/**
 * Invitation Management Routes
 *
 * Comprehensive invitation system for partner collaboration in events.
 * Handles invitation creation, acceptance, rejection, and partner registration.
 * Supports both existing partners and new partner onboarding.
 */
const router = Router()

// Create and send invitation to potential partners
// Validates invitation data and sends email notification
router.post("/invite/:eventId", createInvitationValidation, createInvitationController)

// Handle invitation acceptance by existing partners
// Updates invitation status and assigns partner to booth
router.put("/partners/:invitationId/accept", authenticateUser, handleAcceptedInvitationController)

// Handle invitation acceptance with new partner registration
// Creates new partner account and assigns to booth in one step
router.post(
  "/partners/register/:invitationId/accept",
  authenticateUser,
  createPartnerValidation(),
  handleAcceptedInvitationForNewPartnerController,
)

// Handle invitation rejection/decline
// Updates invitation status to declined
router.put("/:invitationId/reject", authenticateUser, handleRejectedInvitationController)

// Generate shareable invitation link for events
// Provides invitation access for authenticated users
router.get("/events/:eventId", authenticateUser, handleSharableLinkController)

// Retrieve all invitations for a specific event
// Host management tool for tracking event invitations
router.get("/events/:eventId/getAll", getInvitationsForEventController)

// Delete a specific invitation
// Allows hosts to remove unwanted invitations
router.delete("/delete/:invitationId", deleteInvitationByIdController)

export default router
