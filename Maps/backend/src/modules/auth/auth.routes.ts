/**
 * Authentication Routes
 * Defines API endpoints for admin authentication operations
 */

import express from "express"
import {
  adminLoginController,
  adminLogoutController,
  checkAdminLoggedInController as checkAdminLoginController,
} from "./auth.controller"

const authRouter = express.Router()

// Admin authentication endpoints
authRouter.post("/login", adminLoginController) // Admin login
authRouter.get("/check", checkAdminLoginController) // Check login status
authRouter.get("/logout", adminLogoutController) // Admin logout

export default authRouter
