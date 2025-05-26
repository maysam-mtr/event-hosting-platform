/**
 * Invitation Validation Rules
 *
 * Defines validation rules for event invitation management.
 * Handles validation for creating invitations, updating invitation status,
 * and validating invitation access for users. Invitations allow hosts to
 * invite specific users to participate in private events or booth collaborations.
 */
import { check } from "express-validator"

/**
 * Validates event ID for invitation association
 * Ensures invitation is properly linked to an existing event
 */
const eventIdValidation = () => [
  check("eventId").notEmpty().withMessage("Event ID is required").isUUID().withMessage("Event ID must be a valid UUID"),
]

/**
 * Validates invitation link URL
 * Ensures the invitation contains a valid accessible link
 */
const invitationLinkValidation = () => [
  check("invitationLink")
    .notEmpty()
    .withMessage("Event Invitation Link is required")
    .isURL({
      protocols: ["http", "https"], // Only allow HTTP/HTTPS
      require_tld: false, // Allow localhost (no TLD required)
      require_protocol: true, // Require the protocol (e.g., `http://`)
    })
    .withMessage("Link must be a valid URL"),
]

/**
 * Validates booth template ID for invitation
 * Links invitation to a specific booth configuration
 */
const boothTemplateIdValidation = () => [
  check("boothTemplateId")
    .notEmpty()
    .withMessage("Booth template ID is required"),
  // .isUUID().withMessage("Booth template ID must be a valid UUID"),
]

/**
 * Validates assigned email for invitation recipient
 * Ensures invitation is sent to a valid email address
 */
const assignedEmailValidation = () => [
  check("assignedEmail")
    .notEmpty()
    .withMessage("Assigned email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ max: 254 })
    .withMessage("Assigned email must be at most 254 characters long"),
]

/**
 * Validates invitation status updates
 * Restricts status to accepted or declined only
 */
const statusValidation = () => [
  check("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["accepted", "declined"])
    .withMessage("Status must be either 'accepted' or 'declined'"),
]

/**
 * Validates user email for invitation verification
 * Used when checking if a user can access an invitation
 */
const userEmailValidation = () => [
  check("userEmail")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ max: 254 })
    .withMessage("User email must be at most 254 characters long"),
]

/**
 * Combined validation rules for creating a new invitation
 * Includes all required fields for invitation creation
 */
export const createInvitationValidation = [
  ...eventIdValidation(),
  ...boothTemplateIdValidation(),
  ...assignedEmailValidation(),
  ...invitationLinkValidation(),
]

/**
 * Combined validation rules for updating invitation status
 * Used when users accept or decline invitations
 */
export const updateInvitationStatusValidation = [
  check("invitationId")
    .notEmpty()
    .withMessage("Invitation ID is required")
    .isUUID()
    .withMessage("Invitation ID must be a valid UUID"),
  ...statusValidation(),
]

/**
 * Combined validation rules for validating user access to invitations
 * Checks if a user can access a specific booth through invitation
 */
export const validateInvitationForUserValidation = [
  check("boothDetailsId")
    .notEmpty()
    .withMessage("Booth details ID is required")
    .isUUID()
    .withMessage("Booth details ID must be a valid UUID"),
  ...userEmailValidation(),
]
