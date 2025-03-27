import { check } from 'express-validator';

// Validate event ID
const eventIdValidation = () => [
    check('eventId')
        .notEmpty().withMessage("Event ID is required")
        .isUUID().withMessage("Event ID must be a valid UUID"),
];

// Validate booth template ID
const boothTemplateIdValidation = () => [
    check('boothTemplateId')
        .notEmpty().withMessage("Booth template ID is required"),
       // .isUUID().withMessage("Booth template ID must be a valid UUID"),
];

// Validate assigned email
const assignedEmailValidation = () => [
    check('assignedEmail')
        .notEmpty().withMessage("Assigned email is required")
        .isEmail().withMessage("Invalid email format")
        .isLength({ max: 254 }).withMessage("Assigned email must be at most 254 characters long"),
];

// Validate invitation status
const statusValidation = () => [
    check('status')
        .notEmpty().withMessage("Status is required")
        .isIn(['accepted', 'declined']).withMessage("Status must be either 'accepted' or 'declined'"),
];

// Validate user email for invitation validation
const userEmailValidation = () => [
    check('userEmail')
        .notEmpty().withMessage("User email is required")
        .isEmail().withMessage("Invalid email format")
        .isLength({ max: 254 }).withMessage("User email must be at most 254 characters long"),
];

// Combine validations for creating an invitation
export const createInvitationValidation = [
    ...eventIdValidation(),
    ...boothTemplateIdValidation(),
    ...assignedEmailValidation(),
];

// Combine validations for updating an invitation status
export const updateInvitationStatusValidation = [
    check('invitationId')
        .notEmpty().withMessage("Invitation ID is required")
        .isUUID().withMessage("Invitation ID must be a valid UUID"),
    ...statusValidation(),
];

// Combine validations for validating an invitation for a user
export const validateInvitationForUserValidation = [
    check('boothDetailsId')
        .notEmpty().withMessage("Booth details ID is required")
        .isUUID().withMessage("Booth details ID must be a valid UUID"),
    ...userEmailValidation(),
];