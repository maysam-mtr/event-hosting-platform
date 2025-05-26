import express from "express"
import { loginController, logoutController, verifyUserController } from "../controllers/auth.controller"
import { createUserController } from "../controllers/user.controller"
import { userValidation } from "../validation/user.validator"
import { authenticateUser } from "../middleware/authentication"
import { optionalAuth } from "../middleware/optionalAuthentication"

/**
 * User Authentication Routes
 *
 * Manages user authentication flow including registration, login, logout,
 * and session verification. Handles standard user access to the platform.
 */
const router = express.Router()

// User login endpoint
// Authenticates users and establishes session
router.post("/login", loginController)

// Verify user authentication status
// Checks if current session is valid for users
router.get("/auth/verify", authenticateUser, verifyUserController)

// User registration endpoint
// Creates new user accounts with validation
router.post("/register", optionalAuth, userValidation, createUserController)

// User logout endpoint
// Terminates user session and clears authentication
router.post("/logout", authenticateUser, logoutController)

export default router
