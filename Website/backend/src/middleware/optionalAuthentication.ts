/**
 * Optional Authentication Middleware
 *
 * Provides optional JWT authentication for routes that can be accessed
 * by both authenticated and unauthenticated users
 *
 * Features:
 * - Attempts to authenticate if token is present
 * - Continues without authentication if token is missing or invalid
 * - Supports both user and host authentication
 * - Useful for routes with different behavior based on auth status
 */

import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

/**
 * Optional authentication for regular users
 * Attempts to authenticate user but continues regardless of result
 */
const optionalAuth = (req: Request & { [key: string]: any }, res: Response, next: NextFunction) => {
  // Try to retrieve token from Authorization header or cookies
  const cookieName = process.env.USER_TOKEN_COOKIE_NAME || "token"
  const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies[cookieName]

  console.log("Received Authorization header:", req.header("Authorization"))
  console.log(process.env.JWT_SECRET as string)
  console.log("User:", (req as any).user)
  console.log(token)

  // If no token present, continue without authentication
  if (!token) {
    return next()
  }

  try {
    // Attempt to verify and decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    console.log("Decoded token:", decoded)

    // Attach user information to request if token is valid
    ;(req as any).user = decoded
    console.log("User:", (req as any).user)
  } catch (error) {
    console.log("Invalid token, proceeding without authentication")
  }

  next()
}

/**
 * Optional authentication for host users
 * Attempts to authenticate host but continues regardless of result
 */
const optionalHostAuth = (req: Request & { [key: string]: any }, res: Response, next: NextFunction) => {
  // Try to retrieve token from Authorization header or cookies
  const cookieName = process.env.HOST_TOKEN_COOKIE_NAME || "hostToken"
  const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies[cookieName]

  console.log("Received Authorization header:", req.header("Authorization"))
  console.log("host token", req.cookies[cookieName])
  console.log(process.env.JWT_SECRET_HOST as string)
  console.log("token", token)
  console.log("Host user:", (req as any).hostUser)

  // If no token present, continue without authentication
  if (!token) {
    return next()
  }

  try {
    // Attempt to verify and decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_HOST as string)
    console.log("Decoded token:", decoded)

    // Attach host information to request if token is valid
    ;(req as any).hostUser = decoded
    console.log("Host user:", (req as any).hostUser)
  } catch (error) {
    console.log("Invalid token, proceeding without authentication")
  }

  next()
}

export { optionalAuth, optionalHostAuth }
