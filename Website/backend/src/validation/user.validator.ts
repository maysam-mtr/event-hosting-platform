/**
 * User Validation Rules
 *
 * Defines validation rules for user registration and profile management.
 * Users are event attendees who can join events, update profiles, and
 * potentially become partners. Includes personal information validation,
 * professional details, and social media links.
 */
import { check } from "express-validator"

/**
 * Validates username for user accounts
 * Ensures unique identification within the platform
 */
const usernameValidation = () => [
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Username must be between 3 and 100 characters long"),
]

/**
 * Validates email address for user accounts
 * Primary method for user communication and account verification
 */
const emailValidation = () => [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ max: 254 })
    .withMessage("Email must be at most 254 characters long"),
]

/**
 * Validates password strength for user accounts
 * Enforces strong password policy for account security
 */
const passwordValidation = () => [
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 180 })
    .withMessage("Password must be between 6 and 180 characters long")
    .isStrongPassword()
    .withMessage("Password should contain lowercase, uppercase, number, and special characters"),
]

/**
 * Validates password change operations
 * Requires verification of old password before setting new one
 */
const changePasswordValidation = () => [
  check("oldPassword").notEmpty().withMessage("Old password is required"),
  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6, max: 180 })
    .withMessage("New password must be between 6 and 180 characters long")
    .isStrongPassword()
    .withMessage("New password should contain lowercase, uppercase, number, and special characters"),
]

/**
 * Validates user's full name
 * Used for identification and personalization
 */
const fullNameValidation = () => [
  check("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Full name must be between 1 and 255 characters long"),
]

/**
 * Validates date of birth
 * Used for age verification and demographic analysis
 */
const dateOfBirthValidation = () => [
  check("dateOfBirth").notEmpty().withMessage("Date of birth is required").isDate().withMessage("Invalid date format"),
]

/**
 * Validates country information
 * Used for geographic analysis and event targeting
 */
const countryValidation = () => [
  check("country").optional().isLength({ max: 100 }).withMessage("Country must be at most 100 characters long"),
]

/**
 * Validates education level
 * Helps with professional networking and event matching
 */
const educationLevelValidation = () => [
  check("educationLevel")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Education level must be at most 100 characters long"),
]

/**
 * Validates field of study
 * Used for academic and professional networking
 */
const fieldOfStudyValidation = () => [
  check("fieldOfStudy")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Field of study must be at most 100 characters long"),
]

/**
 * Validates preferred event types
 * Helps recommend relevant events to users
 */
const preferredEventTypeValidation = () => [
  check("preferredEventType")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Preferred event type must be at most 100 characters long"),
]

/**
 * Validates years of professional experience
 * Used for professional networking and career-focused events
 */
const yearsOfExperienceValidation = () => [
  check("yearsOfExperience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Years of experience must be a non-negative integer"),
]

/**
 * Validates LinkedIn profile URL
 * Enables professional networking connections
 */
const linkedinValidation = () => [check("linkedin").optional().isURL().withMessage("Invalid LinkedIn URL")]

/**
 * Validates GitHub profile URL
 * Useful for technical events and developer networking
 */
const githubValidation = () => [check("github").optional().isURL().withMessage("Invalid GitHub URL")]

/**
 * Validates profile picture URL
 * Used for user identification and personalization
 */
export const profilePicValidation = () => [
  check("profilePic").optional().isURL().withMessage("Profile picture must be a valid URL"),
]

/**
 * Complete validation rules for user registration
 * Includes all required fields for account creation
 */
const userValidation = [
  ...usernameValidation(),
  ...emailValidation(),
  ...passwordValidation(),
  ...fullNameValidation(),
  ...dateOfBirthValidation(),
  ...countryValidation(),
  ...educationLevelValidation(),
  ...fieldOfStudyValidation(),
  ...preferredEventTypeValidation(),
  ...yearsOfExperienceValidation(),
  ...linkedinValidation(),
  ...githubValidation(),
]

/**
 * Validation rules for updating user profile
 * All fields are optional to allow partial updates
 */
export const updateUserValidation = () => [
  ...fullNameValidation().map((validation) => validation.optional()),
  ...usernameValidation().map((validation) => validation.optional()),
  ...emailValidation().map((validation) => validation.optional()),
  ...profilePicValidation().map((validation) => validation.optional()),
  ...dateOfBirthValidation().map((validation) => validation.optional()),
  ...countryValidation().map((validation) => validation.optional()),
  ...educationLevelValidation().map((validation) => validation.optional()),
  ...fieldOfStudyValidation().map((validation) => validation.optional()),
  ...preferredEventTypeValidation().map((validation) => validation.optional()),
  ...yearsOfExperienceValidation().map((validation) => validation.optional()),
  ...linkedinValidation().map((validation) => validation.optional()),
  ...githubValidation().map((validation) => validation.optional()),
]

export { userValidation, changePasswordValidation }
