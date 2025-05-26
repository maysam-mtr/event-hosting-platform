/**
 * Invitation Controller
 *
 * Comprehensive invitation management system handling:
 * - Creating and sending booth invitations to partners
 * - Managing invitation responses (accept/reject)
 * - Partner registration through invitation acceptance
 * - Invitation validation and access control
 * - Event-specific invitation management
 */

import type { Request, Response } from "express"
import {
  createInvitation,
  validateInvitationForUser,
  handleAcceptedInvitation,
  handleRejectedInvitation,
  getInvitationsForEvent,
  deleteInvitationById,
} from "../services/invitation.service"
import { validationResult } from "express-validator"
import { sendResponse } from "../Utils/responseHelper"
import { getUser } from "../services/user.service"

/**
 * Creates and sends a booth invitation to a potential partner
 * Links invitation to specific event and booth template
 */
const createInvitationController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params
    const { boothTemplateId, assignedEmail, invitationLink } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      sendResponse(
        res,
        false,
        400,
        "Validation Failed",
        [],
        [{ code: "VALIDATION_ERROR", message: errors.array()[0].msg }],
      )
      return
    }

    // Create invitation record and send notification
    const result = await createInvitation(eventId, boothTemplateId, assignedEmail, invitationLink)

    sendResponse(res, true, 201, "Invitation sent successfully", [result])
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to send invitation",
      [],
      [{ code: "CREATE_INVITATION_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Handles invitation acceptance for new partners
 * Creates partner profile during invitation acceptance process
 */
const handleAcceptedInvitationForNewPartnerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invitationId } = req.params
    const { companyName, companyLogo, primaryContactFullName, primaryContactEmail } = req.body
    const userId = (req as any).user?.id

    // Validate partner registration data
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      sendResponse(
        res,
        false,
        400,
        "Validation Failed",
        [],
        [{ code: "VALIDATION_ERROR", message: errors.array()[0].msg }],
      )
      return
    }

    // Accept invitation and create partner profile
    const result = await handleAcceptedInvitation(userId, invitationId, {
      companyName,
      companyLogo,
      primaryContactFullName,
      primaryContactEmail,
    })

    sendResponse(res, true, 200, "Invitation accepted successfully", result)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to accept invitation",
      [],
      [{ code: "ACCEPT_INVITATION_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Handles invitation acceptance for existing partners
 * Validates partner status before processing acceptance
 */
const handleAcceptedInvitationController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invitationId } = req.params
    const userId = (req as any).user?.id

    // Verify user is registered as a partner
    const user = await getUser(userId)
    if (!user || user.isPartner === 0) {
      sendResponse(
        res,
        false,
        400,
        "User is not partner",
        [],
        [{ code: "NOT_A_PARTNER", message: "The user is not registered as a partner" }],
      )
      return
    }

    console.log(userId)
    // Process invitation acceptance for existing partner
    const result = await handleAcceptedInvitation(userId, invitationId)
    sendResponse(res, true, 200, "Invitation accepted successfully", result)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to accept invitation",
      [],
      [{ code: "ACCEPT_INVITATION_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Handles invitation rejection/decline
 * Updates invitation status and notifies relevant parties
 */
const handleRejectedInvitationController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invitationId } = req.params
    const userId = (req as any).user?.id

    // Process invitation rejection
    const result = await handleRejectedInvitation(userId, invitationId)

    sendResponse(res, true, 200, "Invitation rejected successfully", result)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to reject invitation",
      [],
      [{ code: "REJECT_INVITATION_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Validates invitation access through shareable link
 * Verifies user eligibility to access invitation
 */
const handleSharableLinkController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params
    const userId = (req as any).user?.id

    // Validate invitation access for user
    const result = await validateInvitationForUser(eventId, userId)

    sendResponse(res, true, 200, "Invitation validated successfully", result)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to validate invitation",
      [],
      [{ code: "VALIDATE_INVITATION_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Retrieves all invitations for a specific event
 * Provides host with invitation management overview
 */
const getInvitationsForEventController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params

    // Fetch all invitations for the event
    const result = await getInvitationsForEvent(eventId)

    sendResponse(res, true, 200, "Invitations returned successfully", result)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to get invitation",
      [],
      [{ code: "GET_INVITATION_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Deletes a specific invitation
 * Allows hosts to remove invitations before they are accepted
 */
const deleteInvitationByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invitationId } = req.params

    // Remove invitation from system
    const result = await deleteInvitationById(invitationId)

    sendResponse(res, true, 200, "Invitations deleted successfully", result)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to delete invitation",
      [],
      [{ code: "DELETE_INVITATION_ERROR", message: (err as Error).message }],
    )
  }
}

export {
  createInvitationController,
  handleSharableLinkController,
  handleAcceptedInvitationForNewPartnerController,
  handleAcceptedInvitationController,
  handleRejectedInvitationController,
  getInvitationsForEventController,
  deleteInvitationByIdController,
}
