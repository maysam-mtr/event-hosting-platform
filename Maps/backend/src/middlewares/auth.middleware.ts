/**
 * Authentication Middleware
 * Handles role-based authentication using JWT tokens stored in cookies
 * Supports Admin, Host, and User roles with hierarchical permissions
 */

/// <reference path="../types/express/index.d.ts" />

import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import { verifyJWT } from "./jwt.service"
import {
  JWT_ADMIN_ACCESS_TOKEN_SECRET,
  JWT_HOST_ACCESS_TOKEN_SECRET,
  HOST_TOKEN_COOKIE_NAME,
  ADMIN_TOKEN_COOKIE_NAME,
  JWT_USER_ACCESS_TOKEN_SECRET,
  USER_TOKEN_COOKIE_NAME,
} from "@config/index"
import type { NextFunction, Request, Response } from "express"
import { Roles } from "./roles"

/**
 * Helper function to verify JWT token and attach role information
 */
const verifyTokenForRole = async (
  token: string,
  secret: string,
  role: Roles,
): Promise<{ [key: string]: any; role: Roles }> => {
  const payload = await verifyJWT(token, secret)
  return { ...payload, role }
}

/**
 * Role-based authentication middleware factory
 * Admins always have access, other roles require explicit permission
 *
 * @param allowedRoles - Array of roles permitted access (excluding admin)
 * @returns Express middleware function
 */
export const roleAuthMiddleware = (allowedRoles: Roles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check admin token first (admins have universal access)
      const adminToken = req.cookies[ADMIN_TOKEN_COOKIE_NAME as string]
      if (adminToken) {
        try {
          const adminPayload = await verifyTokenForRole(
            adminToken,
            JWT_ADMIN_ACCESS_TOKEN_SECRET as string,
            Roles.ADMIN,
          )
          req.context = adminPayload
          return next()
        } catch (error) {
          // Continue to check other tokens if admin token is invalid
        }
      }

      // Check host token if host role is allowed
      if (allowedRoles.includes(Roles.HOST)) {
        const hostToken = req.cookies[HOST_TOKEN_COOKIE_NAME as string]
        if (hostToken) {
          try {
            const hostPayload = await verifyTokenForRole(hostToken, JWT_HOST_ACCESS_TOKEN_SECRET as string, Roles.HOST)
            req.context = hostPayload
            return next()
          } catch (error) {
            // Continue checking if host token validation fails
          }
        }
      }

      // Check user token if user role is allowed
      if (allowedRoles.includes(Roles.USER)) {
        const userToken = req.cookies[USER_TOKEN_COOKIE_NAME as string]
        if (userToken) {
          try {
            const userPayload = await verifyTokenForRole(userToken, JWT_USER_ACCESS_TOKEN_SECRET as string, Roles.USER)
            req.context = userPayload
            return next()
          } catch (error) {
            // Continue if user token validation fails
          }
        }
      }

      // Deny access if no valid tokens found
      throw new CustomError("Unauthorized access", 401)
    } catch (error) {
      next(error)
    }
  }
}
