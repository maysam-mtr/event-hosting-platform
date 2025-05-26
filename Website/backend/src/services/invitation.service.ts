/**
 * Invitation Service
 *
 * This service manages the complete invitation system for virtual events including:
 * - Creating and sending invitations to partners
 * - Managing invitation status (pending, accepted, declined, expired)
 * - Partner assignment to booths
 * - Email notifications and automated expiration
 * - Subscription-based invitation limits
 */

import Invitation from "../models/Invitation"
import BoothDetails from "../models/BoothDetails"
import { getBoothDetailsById, getOrCreateBoothDetails } from "./boothDetails.service"
import { createPartner, findPartner } from "./partner.service"
import { getUser } from "./user.service"
import nodemailer from "nodemailer"
import { getNumberOfBooths } from "./subscription.service"
import { getEvent } from "./event.service"
import { Op } from "sequelize"
import cron from "node-cron"

/**
 * Creates a new invitation for a partner to join an event booth
 * Handles booth creation, invitation limits, and email sending
 * Automatically expires existing pending invitations for the same booth/email
 *
 * @param eventId - ID of the event
 * @param boothTemplateId - Template ID for booth creation
 * @param assignedEmail - Email address of the invited partner
 * @param invitationLink - Link for accepting the invitation
 * @returns Object containing booth details and invitation
 * @throws Error if invitation limits exceeded or conflicts exist
 */
export const createInvitation = async (
  eventId: string,
  boothTemplateId: string,
  assignedEmail: string,
  invitationLink: string,
): Promise<any> => {
  try {
    // Create or retrieve booth details for the invitation
    const boothResult = await getOrCreateBoothDetails(eventId, boothTemplateId)
    const boothDetails = boothResult.boothDetails

    // Check if booth already has an accepted invitation
    const acceptedInvitation = await Invitation.findOne({
      where: { boothDetailsId: boothDetails.id, status: "accepted" },
    })

    if (acceptedInvitation) {
      throw new Error("This booth already has an accepted invitation")
    }

    // Prevent multiple accepted invitations per email per event
    const existingAcceptedInvitationInEvent = await Invitation.findOne({
      include: [
        {
          model: BoothDetails,
          where: { eventId },
        },
      ],
      where: {
        assignedEmail,
        status: "accepted",
      },
    })

    if (existingAcceptedInvitationInEvent) {
      throw new Error("This email is already assigned to a booth in this event")
    }

    // Check for existing pending invitation for same booth and email
    const existingInvitation = await Invitation.findOne({
      where: { boothDetailsId: boothDetails.id, assignedEmail, status: "pending" },
    })
    if (existingInvitation) {
      throw new Error("An invitation for this booth and email already exists")
    }

    const event = await getEvent(eventId)

    // Validate subscription limits for daily invitations
    const maxInvitationsPerDay = await getNumberOfBooths(event.subscriptionId)
    const invitationsToday = await countInvitations(eventId)
    if (invitationsToday >= maxInvitationsPerDay) {
      throw new Error(`The event has reached the maximum of ${maxInvitationsPerDay} invitations per day`)
    }

    // Expire any existing pending invitation for this booth
    const pendingInvitation = await Invitation.findOne({
      where: {
        boothDetailsId: boothDetails.id,
        status: "pending",
      },
    })

    // Set expiration date to 7 days from now
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    if (pendingInvitation) {
      pendingInvitation.status = "expired"
      await pendingInvitation.save()
    }

    // Expire any existing pending invitation for this email in the event
    const existingPendingInvitationInEvent = await Invitation.findOne({
      include: [
        {
          model: BoothDetails,
          where: { eventId },
        },
      ],
      where: {
        assignedEmail,
        status: "pending",
      },
    })

    if (existingPendingInvitationInEvent) {
      existingPendingInvitationInEvent.status = "expired"
      await existingPendingInvitationInEvent.save()
    }

    // Reactivate expired invitation if exists, otherwise create new one
    let invitation = await Invitation.findOne({
      where: { boothDetailsId: boothDetails.id, assignedEmail, status: "expired" },
    })

    if (invitation) {
      invitation.status = "pending"
      invitation.expiresAt = expiresAt
      await invitation.save()
    } else {
      invitation = await Invitation.create({
        boothDetailsId: boothDetails.id,
        assignedEmail,
        status: "pending",
        expiresAt,
      })
    }

    // Send invitation email to partner
    await sendInvitationEmail(assignedEmail, invitationLink)

    return {
      boothDetails: boothDetails,
      invitation: invitation.toJSON(),
    }
  } catch (error) {
    throw new Error((error as Error).message || "Failed to create invitation.")
  }
}

/**
 * Counts the number of invitations created for an event today
 * Used to enforce daily invitation limits based on subscription
 *
 * @param eventId - ID of the event
 * @returns Number of invitations created today
 * @throws Error if counting fails
 */
export const countInvitations = async (eventId: string): Promise<number> => {
  try {
    // Define today's time boundaries
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    // Count invitations created today for this event
    const invitationsToday = await Invitation.count({
      include: [
        {
          model: BoothDetails,
          where: { eventId },
        },
      ],
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    })
    console.log("invitationsToday", invitationsToday)
    return invitationsToday
  } catch (error) {
    throw new Error((error as Error).message || "Failed to count invitations")
  }
}

/**
 * Updates the status of an invitation (accept/decline)
 * Validates user authorization and invitation state
 *
 * @param userId - ID of the user updating the invitation
 * @param invitationId - ID of the invitation to update
 * @param status - New status (accepted or declined)
 * @returns Updated invitation object
 * @throws Error if unauthorized or invalid state
 */
export const updateInvitationStatus = async (
  userId: string,
  invitationId: string,
  status: "accepted" | "declined",
): Promise<any> => {
  try {
    // Retrieve invitation and validate existence
    const invitation = await Invitation.findByPk(invitationId)
    if (!invitation) {
      throw new Error("Invitation not found")
    }

    // Validate user authorization
    const user = await getUser(userId)
    if (!user) {
      throw new Error("User not found")
    }

    console.log(invitation.assignedEmail)
    console.log(user.email)
    if (invitation.assignedEmail !== user.email) {
      throw new Error("You are not authorized to join this event as partner")
    }

    // Validate invitation state
    if (invitation.status === "expired") {
      throw new Error("Invitation expired ")
    }
    if (invitation.status !== "pending") {
      throw new Error("Only pending invitations can be accepted or rejected ")
    }

    // Prevent multiple accepted invitations for same booth
    const acceptedInvitation = await Invitation.findOne({
      where: { boothDetailsId: invitation.boothDetailsId, status: "accepted" },
    })

    if (acceptedInvitation) {
      throw new Error("This booth already has an accepted invitation")
    }

    // Update invitation status
    invitation.status = status
    await invitation.save()

    return {
      invitation: invitation.toJSON(),
    }
  } catch (error) {
    throw new Error((error as Error).message || "Failed to update invitation status.")
  }
}

/**
 * Assigns a partner to a booth after invitation acceptance
 * Creates new partner profile if user is not already a partner
 * Validates booth availability and partner uniqueness per event
 *
 * @param boothDetailsId - ID of the booth to assign partner to
 * @param userId - ID of the user becoming a partner
 * @param partnerDetails - Optional partner company information for new partners
 * @returns Updated booth details with partner assignment
 * @throws Error if assignment fails or conflicts exist
 */
export const assignPartnerToBooth = async (
  boothDetailsId: string,
  userId: string,
  partnerDetails?: {
    companyName: string
    companyLogo: string
    primaryContactFullName: string
    primaryContactEmail: string
  },
): Promise<any> => {
  try {
    // Retrieve booth details
    const boothDetails = await getBoothDetailsById(boothDetailsId)
    if (!boothDetails) {
      throw new Error("Booth details not found")
    }

    // Find existing partner or prepare to create new one
    let partner = await findPartner(userId)
    console.log("patner", partner)
    if (partner === 0) {
      console.log("new partner")
      if (!partnerDetails) {
        throw new Error("Partner details required for new partner ")
      }

      // Get user information for partner creation
      const user = await getUser(userId)
      if (!user) {
        throw new Error("User not found")
      }

      // Update user role to partner
      if (user.isPartner === 0) {
        user.isPartner = 1
        await user.save()
      }

      // Create new partner profile
      partner = await createPartner(
        userId,
        partnerDetails.primaryContactFullName,
        partnerDetails.primaryContactEmail,
        partnerDetails.companyName,
        partnerDetails.companyLogo,
      )
    }
    console.log("existing", partner.id)

    // Validate partner is not already assigned to another booth in this event
    const existingBooth = await BoothDetails.findOne({
      where: {
        partnerId: partner.id,
        eventId: boothDetails.eventId,
      },
    })

    if (existingBooth) {
      throw new Error("This partner is already assigned to a booth in this event")
    }

    // Assign partner to booth
    boothDetails.partnerId = partner.id
    console.log("before", boothDetails)
    await boothDetails.save()
    console.log(boothDetails)

    return {
      boothDetails: boothDetails,
    }
  } catch (error) {
    throw new Error((error as Error).message || "Failed to assign partner to booth.")
  }
}

/**
 * Retrieves an invitation by its ID
 *
 * @param invitationId - ID of the invitation
 * @returns Invitation object
 * @throws Error if invitation not found
 */
export const getInvitationById = async (invitationId: string): Promise<any> => {
  try {
    const invitation = await Invitation.findByPk(invitationId)

    if (!invitation) {
      throw new Error("Invitation not found")
    }

    return invitation.toJSON()
  } catch (error) {
    console.error("Error in deleteInvitationById:", error)
    throw new Error((error as Error).message || "Failed to delete invitation.")
  }
}

/**
 * Handles the complete process of accepting an invitation
 * Combines partner assignment and invitation status update
 *
 * @param userId - ID of the user accepting the invitation
 * @param invitationId - ID of the invitation being accepted
 * @param partnerDetails - Optional partner information for new partners
 * @returns Object containing updated invitation and booth details
 * @throws Error if acceptance process fails
 */
export const handleAcceptedInvitation = async (
  userId: string,
  invitationId: string,
  partnerDetails?: {
    companyName: string
    companyLogo: string
    primaryContactFullName: string
    primaryContactEmail: string
  },
): Promise<any> => {
  try {
    const invitation = await getInvitationById(invitationId)

    // Assign partner to booth
    const boothDetails = await assignPartnerToBooth(invitation.boothDetailsId, userId, partnerDetails)

    // Update invitation status to accepted
    const updatedInvitation = await updateInvitationStatus(userId, invitationId, "accepted")

    return {
      invitation: updatedInvitation.invitation,
      boothDetails: boothDetails.boothDetails,
    }
  } catch (error) {
    throw new Error((error as Error).message || "Failed to handle accepted invitation.")
  }
}

/**
 * Handles the process of rejecting an invitation
 * Simply updates the invitation status to declined
 *
 * @param userId - ID of the user rejecting the invitation
 * @param invitationId - ID of the invitation being rejected
 * @returns Object containing updated invitation
 * @throws Error if rejection process fails
 */
export const handleRejectedInvitation = async (userId: string, invitationId: string): Promise<any> => {
  try {
    const updatedInvitation = await updateInvitationStatus(userId, invitationId, "declined")

    return {
      invitation: updatedInvitation.invitation,
    }
  } catch (error) {
    throw new Error((error as Error).message || "Failed to handle accepted invitation.")
  }
}

/**
 * Validates if a user has a pending invitation for a specific event
 * Used to check invitation status when user accesses event
 *
 * @param eventId - ID of the event
 * @param userId - ID of the user
 * @returns Object containing invitation details and partner status
 * @throws Error if no pending invitation found
 */
export const validateInvitationForUser = async (eventId: string, userId: string): Promise<any> => {
  try {
    const user = await getUser(userId)
    const userEmail = user.email

    // Find pending invitation for this user's email in the event
    const invitation = await Invitation.findOne({
      include: [
        {
          model: BoothDetails,
          where: { eventId },
        },
      ],
      where: {
        assignedEmail: userEmail,
        status: "pending",
      },
    })
    if (!invitation) {
      throw new Error("No pending invitation found for this event and user.")
    }
    const isPartner = user.isPartner === 1
    return {
      invitation: invitation.toJSON(),
      isPartner: isPartner,
    }
  } catch (error) {
    throw new Error((error as Error).message || "Failed to validate invitation.")
  }
}

/**
 * Sends invitation email to partner using nodemailer
 * Configures Gmail SMTP for email delivery
 *
 * @param partnerEmail - Email address of the partner
 * @param invitationLink - Link for accepting the invitation
 * @throws Error if email sending fails
 */
export const sendInvitationEmail = async (partnerEmail: string, invitationLink: string): Promise<void> => {
  try {
    // Configure Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.INVITATION_EMAIL,
        pass: process.env.INVITATION_PASS,
      },
    })

    // Define email content and formatting
    const mailOptions = {
      from: '"Virtual Event" <uobseniors2025@gmail.com>',
      to: partnerEmail,
      subject: "You are invited to join the Virtual Event",
      html: `
                 <p>Click the link below to accept your invitation:</p>
                 <a href="${invitationLink}" target="_blank">
                 <strong>Click Here</strong>
                 </a>
                `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.response)
  } catch (err) {
    console.error("Error sending email:", err)
  }
}

/**
 * Retrieves all invitations for a specific event
 * Includes booth details for each invitation
 *
 * @param eventId - ID of the event
 * @returns Object containing array of invitations
 * @throws Error if no invitations found or retrieval fails
 */
export const getInvitationsForEvent = async (eventId: string): Promise<any> => {
  try {
    const invitations = await Invitation.findAll({
      include: [
        {
          model: BoothDetails,
          where: { eventId },
        },
      ],
    })

    if (!invitations || invitations.length === 0) {
      throw new Error("No invitations found for this event")
    }

    return {
      invitations: invitations.map((invitation) => invitation.toJSON()),
    }
  } catch (error) {
    console.error("Error in getInvitationsForEvent:", error)
    throw new Error((error as Error).message || "Failed to retrieve invitations.")
  }
}

/**
 * Deletes an invitation by its ID
 * Permanently removes invitation from database
 *
 * @param invitationId - ID of the invitation to delete
 * @throws Error if invitation not found or deletion fails
 */
export const deleteInvitationById = async (invitationId: string): Promise<any> => {
  try {
    const invitation = await Invitation.findByPk(invitationId)

    if (!invitation) {
      throw new Error("Invitation not found")
    }

    await invitation.destroy()

    return
  } catch (error) {
    console.error("Error in deleteInvitationById:", error)
    throw new Error((error as Error).message || "Failed to delete invitation.")
  }
}

/**
 * Automated function to expire pending invitations
 * Runs as scheduled task to update expired invitations
 * Changes status from 'pending' to 'expired' for overdue invitations
 */
const expireInvitations = async (): Promise<void> => {
  try {
    const now = new Date()

    // Find all pending invitations that have passed their expiration date
    const expiredInvitations = await Invitation.findAll({
      where: {
        status: "pending",
        expiresAt: {
          [Op.lte]: now,
        },
      },
    })

    // Update expired invitations status
    for (const invitation of expiredInvitations) {
      await invitation.update({ status: "expired" })
    }

    console.log(`Expired ${expiredInvitations.length} invitations.`)
  } catch (error) {
    console.error("Failed to expire invitations:", (error as Error).message)
  }
}

// Schedule automated invitation expiration task
// Runs every 12 hours (at midnight and noon) to check for expired invitations
cron.schedule("0 0,12 * * *", async () => {
  console.log("Running scheduled task to expire invitations...")
  await expireInvitations()
})
