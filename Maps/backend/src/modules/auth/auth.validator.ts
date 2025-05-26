/**
 * Authentication Input Validation
 * Defines validation rules for authentication endpoints
 */

import { check } from "express-validator"

// Username validation rules
const usernameValidation = () => [check("username").notEmpty().withMessage("Username is required")]

// Password validation rules
const passwordValidation = () => [check("password").notEmpty().withMessage("Password is required")]

// Combined validation for admin login
export const validateAdminLogin = [...usernameValidation(), ...passwordValidation()]
