/**
 * Event Validation Rules
 * 
 * Defines validation rules for event creation and updates using express-validator.
 * Ensures data integrity and security for event-related operations including:
 * - Event name validation with length constraints
 * - Date validation preventing past dates
 * - Time format validation (24-hour HH:mm format)
 * - Event type validation (public/private)
 * - UUID validation for related entities
 */
import { check } from 'express-validator';

/**
 * Validates event name field
 * Ensures event has a meaningful name within reasonable length limits
 */
export const eventNameValidation = () => [
    check('eventName')
        .notEmpty()
        .withMessage("Event name is required")
        .isLength({ min: 1, max: 255 })
        .withMessage("Event name must be between 1 and 255 characters long"),
];

/**
 * Validates event start date
 * Ensures date is in valid ISO format and not in the past
 */
export const startDateValidation = () => [
    check('startDate')
        .notEmpty()
        .withMessage("Start date is required")
        .isISO8601().toDate()
        .withMessage("Start date must be a valid ISO 8601 date (YYYY-MM-DD)")
        .custom((value) => {
            const today = new Date();
            const inputDate = new Date(value);

            // Normalize both dates to midnight for comparison
            today.setHours(0, 0, 0, 0);
            inputDate.setHours(0, 0, 0, 0);

            if (inputDate < today) {
                throw new Error("Start date cannot be in the past");
            }
            return true;
        }),
];

/**
 * Validates event end date
 * Ensures date is in valid ISO format and not in the past
 */
export const endDateValidation = () => [
    check('endDate')
        .notEmpty()
        .withMessage("End date is required")
        .isISO8601().toDate()
        .withMessage("End date must be a valid ISO 8601 date (YYYY-MM-DD)")
        .custom((value) => {
            const today = new Date();
            const inputDate = new Date(value);

            // Normalize both dates to midnight for comparison
            today.setHours(0, 0, 0, 0);
            inputDate.setHours(0, 0, 0, 0);

            if (inputDate < today) {
                throw new Error("End date cannot be in the past");
            }
            return true;
        }),
];


/**
 * Validates event start time
 * Ensures time is in 24-hour HH:mm format
 */
export const startTimeValidation = () => [
    check('startTime')
        .notEmpty()
        .withMessage("Start time is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Start time must be in HH:mm format (24-hour clock)"),
];

/**
 * Validates event end time
 * Ensures time is in 24-hour HH:mm format
 */
export const endTimeValidation = () => [
    check('endTime')
        .notEmpty()
        .withMessage("End time is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("End time must be in HH:mm format (24-hour clock)"),
];

/**
 * Validates event type field
 * Restricts to only 'public' or 'private' event types
 */
export const eventTypeValidation = () => [
    check('eventType')
        .optional()
        .isIn(['public', 'private'])
        .withMessage("Event type must be either 'public' or 'private'"),
];

/**
 * Validates subscription ID
 * Ensures valid UUID format for subscription reference
 */
export const subscriptionIdValidation = () => [
    check('subscriptionId')
        .notEmpty()
        .withMessage("Subscription ID is required")
        .isUUID()
        .withMessage("Subscription ID must be a valid UUID"),
];

/**
 * Validates map template ID
 * Ensures valid UUID format for map template reference
 */
export const mapTemplateIdValidation = () => [
    check('mapTemplateId')
        .notEmpty()
        .withMessage("Map template ID is required")
        .isUUID()
        .withMessage("Map template ID must be a valid UUID"),
];

/**
 * Combined validation rules for creating a new event
 * Includes all required fields with strict validation
 */
export const createEventValidation = () => [
    ...eventNameValidation(),
    ...startDateValidation(),
    ...endDateValidation(),
    ...startTimeValidation(),
    ...endTimeValidation(),
    ...eventTypeValidation(),
    ...subscriptionIdValidation(),
    ...mapTemplateIdValidation(),
];

/**
 * Combined validation rules for updating an existing event
 * All fields are optional to allow partial updates
 */
export const updateEventValidation = () => [
    ...eventNameValidation().map((validation) => validation.optional()),
    ...startDateValidation().map((validation) => validation.optional()),
    ...endDateValidation().map((validation) => validation.optional()),
    ...startTimeValidation().map((validation) => validation.optional()),
    ...endTimeValidation().map((validation) => validation.optional()),
    ...eventTypeValidation().map((validation) => validation.optional()),
    ...mapTemplateIdValidation().map((validation) => validation.optional()),
];
