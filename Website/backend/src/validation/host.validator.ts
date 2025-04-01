import { check } from 'express-validator';

const fullNameValidation = () => [
    check('fullName')
        .notEmpty().withMessage("Full name is required")
        .isLength({ min: 1, max: 255 }).withMessage("Full name must be between 1 and 255 characters long"),
];

const companyNameValidation = () => [
    check('companyName')
        .notEmpty().withMessage("Company name is required")
        .isLength({ min: 1, max: 255 }).withMessage("Company name must be between 1 and 255 characters long"),
];

const emailValidation = () => [
    check('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .isLength({ max: 254 }).withMessage("Email must be at most 254 characters long"),
];

const phoneNumberValidation = () => [
    check('phoneNumber')
        .notEmpty().withMessage("Phone number is required")
        .isLength({ min: 10, max: 15 }).withMessage("Phone number must be between 10 and 15 characters long"),
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

const companyWebsiteValidation = () => [
    check('companyWebsite')
        .optional()
        .isURL().withMessage("Invalid company website URL"),
];

const companyIndustryValidation = () => [
    check('companyIndustry')
        .optional()
        .isLength({ max: 255 }).withMessage("Company industry must be at most 255 characters long"),
];

const businessRegistrationProofValidation = () => [
    check('businessRegistrationProof')
        .optional()
        .isLength({ max: 500 }).withMessage("Business registration proof must be at most 500 characters long"),
];

const termsAgreementValidation = () => [
    check('termsAgreement')
        .isBoolean().withMessage("Terms agreement must be a boolean value")
        .custom((value) => value === true).withMessage("Terms agreement is required"),
];

const privacyAgreementValidation = () => [
    check('privacyAgreement')
        .isBoolean().withMessage("Privacy agreement must be a boolean value")
        .custom((value) => value === true).withMessage("Privacy agreement is required"),
];

const hostValidation = [
    ...fullNameValidation(),
    ...companyNameValidation(),
    ...emailValidation(),
    ...phoneNumberValidation(),
    ...passwordValidation(),
    ...companyWebsiteValidation(),
    ...companyIndustryValidation(),
    ...businessRegistrationProofValidation(),
    ...termsAgreementValidation(),
    ...privacyAgreementValidation(),
];
 const updateHostValidation = () => [
    ...fullNameValidation().map((validation) => validation.optional()),
    ...companyNameValidation().map((validation) => validation.optional()),
    ...emailValidation().map((validation) => validation.optional()),
    ...phoneNumberValidation().map((validation) => validation.optional()),
    ...companyWebsiteValidation().map((validation) => validation.optional()),
    ...companyIndustryValidation().map((validation) => validation.optional()),
    ...termsAgreementValidation().map((validation) => validation.optional()),
    ...privacyAgreementValidation().map((validation) => validation.optional()),
];
export {
    hostValidation,
    changePasswordValidation,
    updateHostValidation
};