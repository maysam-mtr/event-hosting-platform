/* imports */
import { check } from 'express-validator'

const usernameValidation = () => [
    check('username').notEmpty().withMessage("Username is required"),
]

const passwordValidation = () => [
    check('password').notEmpty().withMessage("Password is required"),
]

export const validateAdminLogin = [
    ...usernameValidation(),
    ...passwordValidation(),
]