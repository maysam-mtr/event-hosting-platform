import express from "express"
import {
  getAllUsersController,
  getUserController,
  deleteUserController,
  changePasswordController,
  updateUserController,
} from "../controllers/user.controller"
import { changePasswordValidation, updateUserValidation } from "../validation/user.validator"
import { authenticateUser } from "../middleware/authentication"

/**
 * User Management Routes
 *
 * Comprehensive user account management including profile updates,
 * password changes, account deletion, and user data retrieval.
 */
const router = express.Router()

// Change user password
// Validates new password and requires current password verification
router.post("/cp", changePasswordValidation(), changePasswordController)

// Retrieve all users (administrative function)
// Returns list of all registered users
router.get("/getAll", getAllUsersController)

// Get current user's profile information
// Returns authenticated user's data
router.get("/get", getUserController)

// Delete user account
// Permanently removes user account and associated data
router.delete("/delete", deleteUserController)

// Update user profile information
// Validates and updates user personal and professional details
router.put("/update", authenticateUser, updateUserValidation(), updateUserController)

export default router
