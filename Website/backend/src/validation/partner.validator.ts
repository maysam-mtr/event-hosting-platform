import { check } from 'express-validator';

// Validation for userId
export const userIdValidation = () => [
    check('userId')
        .notEmpty()
        .withMessage("User ID is required")
        .isUUID()
        .withMessage("User ID must be a valid UUID"),
];

// Validation for companyName
export const companyNameValidation = () => [
    check('companyName')
        .notEmpty()
        .withMessage("Company name is required")
        .isLength({ min: 1, max: 255 })
        .withMessage("Company name must be between 1 and 255 characters long"),
];

// Validation for companyIndustry
export const companyIndustryValidation = () => [
    check('companyIndustry')
        .optional()
        .isLength({ min: 1, max: 255 })
        .withMessage("Company industry must be between 1 and 255 characters long"),
];

// Validation for companyWebsite
export const companyWebsiteValidation = () => [
    check('companyWebsite')
        .optional()
        .isURL()
        .withMessage("Company website must be a valid URL"),
];

// Validation for companyLogo
export const companyLogoValidation = () => [
    check('companyLogo')
        .notEmpty()
        .withMessage("Company logo is required")
        .isURL()
        .withMessage("Company logo must be a valid URL"),
];

// Validation for primaryContactFullName
export const primaryContactFullNameValidation = () => [
    check('primaryContactFullName')
        .notEmpty()
        .withMessage("Primary contact full name is required")
        .isLength({ min: 1, max: 255 })
        .withMessage("Primary contact full name must be between 1 and 255 characters long"),
];

// Validation for primaryContactEmail
export const primaryContactEmailValidation = () => [
    check('primaryContactEmail')
        .notEmpty()
        .withMessage("Primary contact email is required")
        .isEmail()
        .withMessage("Primary contact email must be a valid email address"),
];

// Validation for primaryContactJobTitle
export const primaryContactJobTitleValidation = () => [
    check('primaryContactJobTitle')
        .optional()
        .isLength({ min: 1, max: 255 })
        .withMessage("Primary contact job title must be between 1 and 255 characters long"),
];

// Validation for primaryContactPhoneNumber
export const primaryContactPhoneNumberValidation = () => [
    check('primaryContactPhoneNumber')
        .optional()
        .matches(/^\+?[0-9]{1,3}?[-.\s]?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/)
        .withMessage("Primary contact phone number must be a valid phone number format"),
];

// Validation for companyDescription
export const companyDescriptionValidation = () => [
    check('companyDescription')
        .optional()
        .isLength({ min: 1, max: 1000 })
        .withMessage("Company description must be between 1 and 1000 characters long"),
];

// Validation for social media links
export const socialMediaLinkValidation = (field: string) => [
    check(field)
        .optional()
        .isURL()
        .withMessage(`${field} must be a valid URL`),
];

// Combine all validations for creating a partner
export const createPartnerValidation = () => [
    ...companyNameValidation(),
    ...companyLogoValidation(),
    ...primaryContactFullNameValidation(),
    ...primaryContactEmailValidation(),
];

// Combine all validations for updating a partner
export const updatePartnerValidation = () => [
    ...companyNameValidation().map((validation) => validation.optional()),
    ...companyIndustryValidation().map((validation) => validation.optional()),
    ...companyWebsiteValidation().map((validation) => validation.optional()),
    ...companyLogoValidation().map((validation) => validation.optional()),
    ...primaryContactFullNameValidation().map((validation) => validation.optional()),
    ...primaryContactEmailValidation().map((validation) => validation.optional()),
    ...primaryContactJobTitleValidation().map((validation) => validation.optional()),
    ...primaryContactPhoneNumberValidation().map((validation) => validation.optional()),
    ...companyDescriptionValidation().map((validation) => validation.optional()),
    ...socialMediaLinkValidation('linkedinLink').map((validation) => validation.optional()),
    ...socialMediaLinkValidation('instagramLink').map((validation) => validation.optional()),
    ...socialMediaLinkValidation('twitterLink').map((validation) => validation.optional()),
    ...socialMediaLinkValidation('youtubeLink').map((validation) => validation.optional()),
    ...socialMediaLinkValidation('facebookLink').map((validation) => validation.optional()),
    ...socialMediaLinkValidation('tiktokLink').map((validation) => validation.optional()),
];