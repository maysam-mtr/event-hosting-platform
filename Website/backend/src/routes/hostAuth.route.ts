import express from "express"
import { loginHostController, logoutHostController, verifyHostController } from "../controllers/auth.controller"
import { createHostController } from "../controllers/host.controller"
import { hostValidation } from "../validation/host.validator"
import { authenticateHost } from "../middleware/authentication"
import { optionalHostAuth } from "../middleware/optionalAuthentication"

/**
 * Host Authentication Routes
 *
 * Manages host authentication flow including registration, login, logout,
 * and session verification. Separate from user authentication to maintain
 * different access levels and permissions.
 */
const router = express.Router()

// Host login endpoint
// Authenticates hosts and establishes session
router.post("/login", loginHostController)

// Verify host authentication status
// Checks if current session is valid for hosts
router.get("/auth/verify", authenticateHost, verifyHostController)

// Host registration endpoint
// Creates new host accounts with validation
router.post("/register", optionalHostAuth, hostValidation, createHostController)

// Host logout endpoint
// Terminates host session and clears authentication
router.post("/logout", authenticateHost, logoutHostController)

export default router
