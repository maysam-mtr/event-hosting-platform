/**
 * Authentication Middleware
 *
 * JWT-based authentication system for protecting routes
 * Provides separate authentication for:
 * - Regular users (participants/partners)
 * - Host users (event organizers)
 *
 * Validates JWT tokens from HTTP-only cookies and attaches user info to requests
 */

import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { sendResponse } from "../Utils/responseHelper"

/**
 * Authenticates regular users using JWT tokens
 * Validates user token from cookies and attaches user info to request
 */
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const cookieName = process.env.USER_TOKEN_COOKIE_NAME || "token"
  const token = req.cookies[cookieName]

  // Check if authentication token exists
  if (!token) {
    sendResponse(
      res,
      false,
      401,
      "You are not logged in",
      [],
      [{ code: "AUTHORIZATION_ERROR", message: "You are not logged in" }],
    )
    return
  }

  try {
    console.log(token)

    // Verify JWT token using user secret
    const verified = jwt.verify(token, process.env.JWT_SECRET as string)

    // Attach verified user information to request object
    ;(req as any).user = verified
    console.log(verified)
    console.log((req as any).user.id)

    next() // Continue to protected route
  } catch (err) {
    console.error("Token verification failed:", err)
    sendResponse(res, false, 401, "Invalid Token", [], [{ code: "TOKEN_ERROR", message: "Invalid User Token" }])
  }
}

/**
 * Authenticates host users using separate JWT tokens
 * Validates host token from cookies and attaches host info to request
 */
const authenticateHost = (req: Request, res: Response, next: NextFunction) => {
  const cookieName = process.env.HOST_TOKEN_COOKIE_NAME || "hostToken"
  const hostToken = req.cookies[cookieName]
  console.log("Received token:", hostToken)

  // Check if host authentication token exists
  if (!hostToken) {
    sendResponse(
      res,
      false,
      401,
      "You are not logged in",
      [],
      [{ code: "AUTHORIZATION_ERROR", message: "You are not logged in" }],
    )
    return
  }

  try {
    // Verify JWT token using host secret
    const verified = jwt.verify(hostToken, process.env.JWT_SECRET_HOST as string)

    // Attach verified host information to request object
    ;(req as any).hostUser = verified

    next() // Continue to protected route
  } catch (err) {
    sendResponse(res, false, 401, "Invalid Token", [], [{ code: "TOKEN_ERROR", message: "Invalid Host Token" }])
  }
}

export { authenticateUser, authenticateHost }
