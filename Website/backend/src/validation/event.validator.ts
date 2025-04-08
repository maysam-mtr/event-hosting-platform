import { check } from 'express-validator';

// Validation for eventName
export const eventNameValidation = () => [
    check('eventName')
        .notEmpty()
        .withMessage("Event name is required")
        .isLength({ min: 1, max: 255 })
        .withMessage("Event name must be between 1 and 255 characters long"),
];

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


// Validation for eventTime
export const startTimeValidation = () => [
    check('startTime')
        .notEmpty()
        .withMessage("Start time is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Start time must be in HH:mm format (24-hour clock)"),
];
export const endTimeValidation = () => [
    check('endTime')
        .notEmpty()
        .withMessage("End time is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("End time must be in HH:mm format (24-hour clock)"),
];

// Validation for eventType
export const eventTypeValidation = () => [
    check('eventType')
        .optional()
        .isIn(['public', 'private'])
        .withMessage("Event type must be either 'public' or 'private'"),
];

// Validation for subscriptionId
export const subscriptionIdValidation = () => [
    check('subscriptionId')
        .notEmpty()
        .withMessage("Subscription ID is required")
        .isUUID()
        .withMessage("Subscription ID must be a valid UUID"),
];

// Validation for mapTemplateId
export const mapTemplateIdValidation = () => [
    check('mapTemplateId')
        .notEmpty()
        .withMessage("Map template ID is required")
        .isUUID()
        .withMessage("Map template ID must be a valid UUID"),
];

// Combine all validations for creating an event
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

// Combine all validations for updating an event
export const updateEventValidation = () => [
    ...eventNameValidation().map((validation) => validation.optional()),
    ...startDateValidation().map((validation) => validation.optional()),
    ...endDateValidation().map((validation) => validation.optional()),
    ...startTimeValidation().map((validation) => validation.optional()),
    ...endTimeValidation().map((validation) => validation.optional()),
    ...eventTypeValidation().map((validation) => validation.optional()),
    ...mapTemplateIdValidation().map((validation) => validation.optional()),
];
