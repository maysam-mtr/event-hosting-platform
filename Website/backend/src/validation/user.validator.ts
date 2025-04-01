import { check } from 'express-validator';

const usernameValidation = () => [
    check('username')
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 100 }).withMessage("Username must be between 3 and 100 characters long"),
];

const emailValidation = () => [
    check('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .isLength({ max: 254 }).withMessage("Email must be at most 254 characters long"),
];

const passwordValidation = () => [
    check('password')
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6, max: 180 })
        .withMessage("Password must be between 6 and 180 characters long")
        .isStrongPassword()
        .withMessage("Password should contain lowercase, uppercase, number, and special characters"),
];

const changePasswordValidation = () => [
    check('oldPassword')
        .notEmpty()
        .withMessage("Old password is required"),
    check('newPassword')
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6, max: 180 })
        .withMessage("New password must be between 6 and 180 characters long")
        .isStrongPassword()
        .withMessage("New password should contain lowercase, uppercase, number, and special characters"),
];

const fullNameValidation = () => [
    check('fullName')
        .notEmpty().withMessage("Full name is required")
        .isLength({ min: 1, max: 255 }).withMessage("Full name must be between 1 and 255 characters long"),
];

const dateOfBirthValidation = () => [
    check('dateOfBirth')
        .notEmpty().withMessage("Date of birth is required")
        .isDate().withMessage("Invalid date format"),
];

const countryValidation = () => [
    check('country')
        .optional()
        .isLength({ max: 100 }).withMessage("Country must be at most 100 characters long"),
];

const educationLevelValidation = () => [
    check('educationLevel')
        .optional()
        .isLength({ max: 100 }).withMessage("Education level must be at most 100 characters long"),
];

const fieldOfStudyValidation = () => [
    check('fieldOfStudy')
        .optional()
        .isLength({ max: 100 }).withMessage("Field of study must be at most 100 characters long"),
];

const preferredEventTypeValidation = () => [
    check('preferredEventType')
        .optional()
        .isLength({ max: 100 }).withMessage("Preferred event type must be at most 100 characters long"),
];

const yearsOfExperienceValidation = () => [
    check('yearsOfExperience')
        .optional()
        .isInt({ min: 0 }).withMessage("Years of experience must be a non-negative integer"),
];

const linkedinValidation = () => [
    check('linkedin')
        .optional()
        .isURL().withMessage("Invalid LinkedIn URL"),
];

const githubValidation = () => [
    check('github')
        .optional()
        .isURL().withMessage("Invalid GitHub URL"),
];
export const profilePicValidation = () => [
    check('profilePic')
        .optional()
        .isURL()
        .withMessage("Profile picture must be a valid URL"),
];

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
];
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
];
export {
    userValidation,
    changePasswordValidation,
};
