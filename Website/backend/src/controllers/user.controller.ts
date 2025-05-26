/**
 * User Controller
 *
 * Comprehensive user account management including:
 * - User registration and account creation
 * - User profile management and updates
 * - Password change functionality
 * - Account deletion with session cleanup
 * - User data retrieval and validation
 */

import type { Request, Response } from "express"
import { validationResult } from "express-validator"
import { createUser, getAllUsers, getUser, deleteUser, changePassword, updateUser } from "../services/user.service"
import { clearToken } from "../services/auth.service"
import { sendResponse } from "../Utils/responseHelper"

/**
 * Creates a new user account
 * Validates that user is not already logged in to prevent duplicate accounts
 */
const createUserController = async (req: Request, res: Response): Promise<void> => {
  // Prevent account creation if user is already authenticated
  if ((req as any).user) {
    sendResponse(
      res,
      false,
      403,
      "You are already logged in and cannot create a new account.",
      [],
      [{ code: "LOGIN_ERROR", message: "You are already logged in and cannot create a new account." }],
    )
    return
  }

  // Validate request data
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    sendResponse(
      res,
      false,
      400,
      "Validation Failed",
      [],
      [{ code: "VALIDATION_ERROR", message: errors.array()[0].msg }],
    )
    return
  }

  const user = req.body

  try {
    // Create new user account with provided information
    const newUser = await createUser(user)
    sendResponse(res, true, 200, "User created successfully", newUser)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to create user",
      [],
      [{ code: "USER_CREATE_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Retrieves all users in the system
 * Administrative function for user management
 */
const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch complete user list
    const users = await getAllUsers()
    sendResponse(res, true, 200, "Users returned successfully", users)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to return users",
      [],
      [{ code: "RETURN_USERS_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Retrieves current authenticated user's information
 * Returns user profile data for authenticated sessions
 */
const getUserController = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    sendResponse(
      res,
      false,
      400,
      "Validation Failed",
      [],
      [{ code: "VALIDATION_ERROR", message: errors.array()[0].msg }],
    )
    return
  }

  try {
    // Fetch authenticated user's profile information
    const user = await getUser((req as any).user.id)
    sendResponse(res, true, 200, "User returned successfully", [user])
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to return user",
      [],
      [{ code: "USER_GET_ERROR", message: (err as Error).message }],
    )
    return
  }
}

/**
 * Deletes user account and clears authentication
 * Permanently removes user data and logs out user
 */
const deleteUserController = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    sendResponse(
      res,
      false,
      400,
      "Validation Failed",
      [],
      [{ code: "VALIDATION_ERROR", message: errors.array()[0].msg }],
    )
    return
  }

  const userID = (req as any).user.id

  try {
    // Delete user account and associated data
    const user = await deleteUser(userID)

    // Clear authentication session
    clearToken(res)

    sendResponse(res, true, 200, "User deleted successfully", [user])
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to delete user",
      [],
      [{ code: "DELETE_USER_ERROR", message: (err as Error).message }],
    )
    return
  }
}

/**
 * Changes user password with validation
 * Requires current password verification before updating
 */
const changePasswordController = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    sendResponse(
      res,
      false,
      400,
      "Validation Failed",
      [],
      [{ code: "VALIDATION_ERROR", message: errors.array()[0].msg }],
    )
    return
  }

  const { oldPassword, newPassword } = req.body

  try {
    // Verify current user and process password change
    const user = await getUser((req as any).user.id)
    const result = await changePassword({ user, oldPassword, newPassword })

    sendResponse(res, true, 200, "Password changed successfully", result)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to change password",
      [],
      [{ code: "CHANGE_PASSWORD_ERROR", message: (err as Error).message }],
    )
    return
  }
}

/**
 * Updates user profile information
 * Allows users to modify their account details
 */
const updateUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request data
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      sendResponse(
        res,
        false,
        400,
        "Validation Failed",
        [],
        [{ code: "VALIDATION_ERROR", message: errors.array()[0].msg }],
      )
      return
    }

    // Extract user ID and updated information
    const id = (req as any).user?.id
    const updatedData = req.body

    // Update user profile with new information
    const updatedUser = await updateUser(id, updatedData)

    // Return updated user data
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User updated successfully",
      data: updatedUser,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Failed to update user",
      errors: [{ code: "UPDATE_USER_ERROR", message: (error as Error).message }],
    })
  }
}

export {
  createUserController,
  getAllUsersController,
  getUserController,
  deleteUserController,
  changePasswordController,
  updateUserController,
}
