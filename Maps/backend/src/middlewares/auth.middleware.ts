/// <reference path="../types/express/index.d.ts" />

import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import { verifyJWT } from "./jwt.service"
import { JWT_ADMIN_ACCESS_TOKEN_SECRET, JWT_HOST_ACCESS_TOKEN_SECRET, HOST_TOKEN_COOKIE_NAME, ADMIN_TOKEN_COOKIE_NAME, JWT_USER_ACCESS_TOKEN_SECRET, USER_TOKEN_COOKIE_NAME } from "@config/index"
import { NextFunction, Request, Response } from "express"
import { Roles } from "./roles"


/**
 * Helper function: verifies a token with a given secret and attaches the role.
 */
const verifyTokenForRole = async (
  token: string,
  secret: string,
  role: Roles
): Promise<{ [key: string]: any, role: Roles }> => {
  const payload = await verifyJWT(token, secret)
  return { ...payload, role }
}


/**
 * Middleware that always allows admins, and if not an admin,
 * then only allows access if the token belongs to one of the allowedRoles.
 *
 * @param allowedRoles - array of roles (besides admin) that are permitted (e.g., [Roles.HOST, Roles.USER])
 */
export const roleAuthMiddleware = (allowedRoles: Roles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      // Try admin token first
      const adminToken = req.cookies[ADMIN_TOKEN_COOKIE_NAME as string]
      if (adminToken) {
        
        try {
          const adminPayload = await verifyTokenForRole(
            adminToken,
            JWT_ADMIN_ACCESS_TOKEN_SECRET as string,
            Roles.ADMIN
          )
          req.context = adminPayload
          return next()
        } catch (error) {
          // If the admin token is present but invalid, we continue checking others.
        }
      }

      // For host
      if (allowedRoles.includes(Roles.HOST)) {
        const hostToken = req.cookies[HOST_TOKEN_COOKIE_NAME as string]
        if (hostToken) {
          try {
            const hostPayload = await verifyTokenForRole(
              hostToken,
              JWT_HOST_ACCESS_TOKEN_SECRET as string,
              Roles.HOST
            )
            req.context = hostPayload
            return next()
          } catch (error) {
            // Continue checking if host token validation fails.
          }
        }
      }

      // For user
      if (allowedRoles.includes(Roles.USER)) {
        const userToken = req.cookies[USER_TOKEN_COOKIE_NAME as string]
        if (userToken) {
          try {
            const userPayload = await verifyTokenForRole(
              userToken,
              JWT_USER_ACCESS_TOKEN_SECRET as string,
              Roles.USER
            )
            req.context = userPayload
            return next()
          } catch (error) {
            // Continue if user token validation fails.
          }
        }
      }

      //  Deny access if none of the checks passed.
      throw new CustomError("Unauthorized access", 401)
    } catch (error) {
      next(error)
    }
  }
}