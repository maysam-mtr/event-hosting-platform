/**
 * Authentication Controller
 *
 * Handles user and host authentication operations including:
 * - User login/logout with JWT token management
 * - Host login/logout with separate JWT tokens
 * - Cookie-based session management
 * - Token verification for protected routes
 */

import type { Request, Response } from "express"
import { loginUser, loginHost, clearToken, clearHostToken } from "../services/auth.service"
import jwt from "jsonwebtoken"
import { sendResponse } from "../Utils/responseHelper"

/**
 * Authenticates a regular user and sets authentication cookie
 * Creates JWT token and manages user session state
 */
const loginController = async (req: Request, res: Response): Promise<void> => {
  const credentials = req.body
  try {
    // Authenticate user credentials
    const user = await loginUser(credentials)

    // Generate JWT token for authenticated user
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "12h" })
    console.log(token)

    // Set secure HTTP-only cookie for user authentication
    res.cookie(process.env.USER_TOKEN_COOKIE_NAME || "token", token, {
      httpOnly: true, // Prevents client-side JavaScript access
      sameSite: "strict", // CSRF protection
      maxAge: 12 * 60 * 60 * 1000, // 12 hours expiration
      secure: false, // Set to true in production with HTTPS
    })

    // Clear any existing host authentication
    res.clearCookie(process.env.HOST_TOKEN_COOKIE_NAME || "hostToken")

    sendResponse(res, true, 200, "Login successful", [{ user: user }])
  } catch (err) {
    sendResponse(res, false, 401, "Login failed", [], [{ code: "LOGIN_ERROR", message: (err as Error).message }])
  }
}

/**
 * Authenticates a host user and sets host authentication cookie
 * Separate authentication flow for event hosts
 */
const loginHostController = async (req: Request, res: Response): Promise<void> => {
  const credentials = req.body
  try {
    // Authenticate host credentials
    const host = await loginHost(credentials)
    console.log("host id _", host._id)
    console.log("host id without -", host.id)

    // Generate JWT token for authenticated host
    const token = jwt.sign({ id: host.id }, process.env.JWT_SECRET_HOST as string, { expiresIn: "12h" })
    console.log(token)

    // Set secure HTTP-only cookie for host authentication
    res.cookie(process.env.HOST_TOKEN_COOKIE_NAME || "hostToken", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 12 * 60 * 60 * 1000, // 12 hours expiration
      secure: false,
    })

    // Clear any existing user authentication
    res.clearCookie(process.env.USER_TOKEN_COOKIE_NAME || "token")

    sendResponse(res, true, 200, "Host login successful", [{ host: host }])
  } catch (err) {
    sendResponse(
      res,
      false,
      401,
      "Host Login failed",
      [],
      [{ code: "HOST_LOGIN_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Logs out host user by clearing authentication cookie
 */
const logoutHostController = (req: Request, res: Response): void => {
  try {
    clearHostToken(res)
    sendResponse(res, true, 200, "Host logout successful", [])
  } catch (err) {
    console.error(err)
    sendResponse(
      res,
      false,
      500,
      "Host logout failed",
      [],
      [{ code: "HOST_LOGOUT_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Logs out regular user by clearing authentication cookie
 */
const logoutController = (req: Request, res: Response): void => {
  try {
    clearToken(res)
    sendResponse(res, true, 200, "Logout successful", [])
  } catch (err) {
    console.error(err)
    sendResponse(res, false, 500, "Logout failed", [], [{ code: "LOGOUT_ERROR", message: (err as Error).message }])
  }
}

/**
 * Verifies user authentication status
 * Used by middleware to confirm valid user session
 */
const verifyUserController = (req: Request, res: Response): void => {
  try {
    sendResponse(res, true, 200, "User verified", [])
  } catch (err) {
    console.error(err)
    sendResponse(
      res,
      false,
      500,
      "User verification failed",
      [],
      [{ code: "USER_VERIFICATION_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Verifies host authentication status
 * Used by middleware to confirm valid host session
 */
const verifyHostController = (req: Request, res: Response): void => {
  try {
    sendResponse(res, true, 200, "Host verified", [])
  } catch (err) {
    console.error(err)
    sendResponse(
      res,
      false,
      500,
      "Host verification failed",
      [],
      [{ code: "HOST_VERIFICATION_ERROR", message: (err as Error).message }],
    )
  }
}

export {
  loginController,
  logoutController,
  logoutHostController,
  verifyUserController,
  loginHostController,
  verifyHostController,
}
