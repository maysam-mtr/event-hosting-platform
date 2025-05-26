/**
 * Authentication Controller
 * Handles admin login, logout, and authentication status checking
 */

import type { NextFunction, Request, Response } from "express"
import { adminLoginService } from "./auth.service"
import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import { CustomResponse } from "@/utils/Response & Error Handling/custom-response"
import { clearToken, verifyJWT } from "@/middlewares/jwt.service"
import { ADMIN_TOKEN_COOKIE_NAME, JWT_ADMIN_ACCESS_TOKEN_SECRET } from "@/config"

/**
 * Admin Login Controller
 * Authenticates admin credentials and sets secure HTTP-only cookie
 */
export const adminLoginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if user is already logged in
    const token = req.cookies[ADMIN_TOKEN_COOKIE_NAME as string]
    if (token) {
      const payload = await verifyJWT(token, JWT_ADMIN_ACCESS_TOKEN_SECRET as string)
      if (payload) {
        return CustomResponse(res, 200, "Already logged in")
      }
    }

    const loginData = req.body
    const response = await adminLoginService(loginData)

    // Set secure HTTP-only cookie with JWT token
    res.cookie(ADMIN_TOKEN_COOKIE_NAME as string, response.accessToken, {
      httpOnly: true, // Prevent client-side access
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 7200000, // 2 hours expiration
      secure: false, // Set to true in production with HTTPS
    })

    CustomResponse(res, 200, "Admin login successful")
  } catch (error) {
    next(error)
  }
}

/**
 * Check Admin Login Status Controller
 * Verifies if admin is currently authenticated
 */
export const checkAdminLoggedInController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies[ADMIN_TOKEN_COOKIE_NAME as string]
    if (token) {
      const payload = await verifyJWT(token, JWT_ADMIN_ACCESS_TOKEN_SECRET as string)
      if (payload) {
        return CustomResponse(res, 200, "Already logged in")
      }
    }
    throw new CustomError("Not logged in", 401)
  } catch (error) {
    next(error)
  }
}

/**
 * Admin Logout Controller
 * Clears authentication cookie and logs out admin
 */
export const adminLogoutController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    clearToken(res)
    CustomResponse(res, 200, "Admin logout successful")
  } catch (error) {
    next(error)
  }
}
