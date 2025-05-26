/**
 * Authentication middleware for host authorization
 *
 * This middleware validates JWT tokens from cookies to ensure only
 * authorized hosts can access protected endpoints. It verifies the
 * token signature and extracts user context for downstream handlers.
 */

/// <reference path="../types/express/index.d.ts" />

import { verifyJWT } from "./jwt.service"
import { JWT_HOST_ACCESS_TOKEN_SECRET, HOST_TOKEN_COOKIE_NAME } from "@/config/index"
import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import type { NextFunction, Request, Response } from "express"

/**
 * Verifies a host JWT token and returns the payload with host flag
 *
 * @param token - JWT token string to verify
 * @returns Promise resolving to the token payload with isHost flag
 * @throws Error if token verification fails
 */
const verifyHostToken = async (token: string) => {
  const payload = await verifyJWT(token, JWT_HOST_ACCESS_TOKEN_SECRET as string)

  return { ...payload, isHost: true }
}

/**
 * Express middleware to authenticate host requests
 *
 * Extracts JWT token from cookies, verifies it, and adds the decoded
 * context to the request object. Only allows requests with valid host tokens.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const hostAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from cookies using configured cookie name
    const cookieName = HOST_TOKEN_COOKIE_NAME ?? "hostToken"
    const token = req.cookies[cookieName]

    if (!token) {
      throw new CustomError("Unautherized access", 401)
    }

    // Verify token and add context to request
    req.context = await verifyHostToken(token)

    // Ensure the token represents a valid host
    if (!req.context.isHost) {
      throw new CustomError("Valid external token required", 403)
    }

    next()
  } catch (error) {
    next(error)
  }
}
