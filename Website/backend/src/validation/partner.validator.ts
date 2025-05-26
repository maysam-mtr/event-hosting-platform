/**
 * Partner Validation Rules
 *
 * Defines validation rules for partner registration and profile management.
 * Partners are companies or organizations that collaborate with event hosts
 * to provide booths, sponsorships, or other services at events.
 * Includes comprehensive business information validation and social media links.
 */
import { check } from "express-validator"

/**
 * Validates user ID association
 * Links partner profile to an existing user account
 */
export const userIdValidation = () => [
  check("userId").notEmpty().withMessage("User ID is required").isUUID().withMessage("User ID must be a valid UUID"),
]

/**
 * Validates company name
 * Primary identifier for the partner organization
 */
export const companyNameValidation = () => [
  check("companyName")
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Company name must be between 1 and 255 characters long"),
]

/**
 * Validates company industry classification
 * Helps categorize partners and match them with relevant events
 */
export const companyIndustryValidation = () => [
  check("companyIndustry")
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage("Company industry must be between 1 and 255 characters long"),
]

/**
 * Validates company website URL
 * Provides additional verification and information about the partner
 */
export const companyWebsiteValidation = () => [
  check("companyWebsite").optional().isURL().withMessage("Company website must be a valid URL"),
]

/**
 * Validates company logo URL
 * Required for branding and visual identification in events
 */
export const companyLogoValidation = () => [
  check("companyLogo")
    .notEmpty()
    .withMessage("Company logo is required")
    .isURL()
    .withMessage("Company logo must be a valid URL"),
]

/**
 * Validates primary contact person's full name
 * Main point of contact for partnership communications
 */
export const primaryContactFullNameValidation = () => [
  check("primaryContactFullName")
    .notEmpty()
    .withMessage("Primary contact full name is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Primary contact full name must be between 1 and 255 characters long"),
]

/**
 * Validates primary contact email address
 * Essential for partnership communications and coordination
 */
export const primaryContactEmailValidation = () => [
  check("primaryContactEmail")
    .notEmpty()
    .withMessage("Primary contact email is required")
    .isEmail()
    .withMessage("Primary contact email must be a valid email address"),
]

/**
 * Validates primary contact job title
 * Provides context for the contact person's authority and role
 */
export const primaryContactJobTitleValidation = () => [
  check("primaryContactJobTitle")
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage("Primary contact job title must be between 1 and 255 characters long"),
]

/**
 * Validates primary contact phone number
 * Allows for direct communication when needed
 */
export const primaryContactPhoneNumberValidation = () => [
  check("primaryContactPhoneNumber")
    .optional()
    .matches(/^\+?[0-9]{1,3}?[-.\s]?($$\?\d{1,4}$$\?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/)
    .withMessage("Primary contact phone number must be a valid phone number format"),
]

/**
 * Validates company description
 * Provides detailed information about the partner's business and services
 */
export const companyDescriptionValidation = () => [
  check("companyDescription")
    .optional()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Company description must be between 1 and 1000 characters long"),
]

/**
 * Generic validation for social media links
 * Ensures social media URLs are properly formatted
 * @param field - Name of the social media field being validated
 */
export const socialMediaLinkValidation = (field: string) => [
  check(field).optional().isURL().withMessage(`${field} must be a valid URL`),
]

/**
 * Combined validation rules for creating a new partner
 * Includes essential fields required for partner registration
 */
export const createPartnerValidation = () => [
  ...companyNameValidation(),
  ...companyLogoValidation(),
  ...primaryContactFullNameValidation(),
  ...primaryContactEmailValidation(),
]

/**
 * Combined validation rules for updating partner profile
 * All fields are optional to allow partial updates
 */
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
  ...socialMediaLinkValidation("linkedinLink").map((validation) => validation.optional()),
  ...socialMediaLinkValidation("instagramLink").map((validation) => validation.optional()),
  ...socialMediaLinkValidation("twitterLink").map((validation) => validation.optional()),
  ...socialMediaLinkValidation("youtubeLink").map((validation) => validation.optional()),
  ...socialMediaLinkValidation("facebookLink").map((validation) => validation.optional()),
  ...socialMediaLinkValidation("tiktokLink").map((validation) => validation.optional()),
]
