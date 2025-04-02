/// <reference path="../types/express/index.d.ts" />

import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import { verifyJWT } from "./jwt.service"
import { JWT_ADMIN_ACCESS_TOKEN_SECRET, JWT_HOST_ACCESS_TOKEN_SECRET, HOST_TOKEN_COOKIE_NAME, ADMIN_TOKEN_COOKIE_NAME } from "@config/index"
import { NextFunction, Request, Response } from "express"

const verifyAdminToken = async (token: string) => {
    const payload = await verifyJWT(token, JWT_ADMIN_ACCESS_TOKEN_SECRET as string)

    return { ...payload, isAdmin: true }
}

const verifyHostToken = async (token: string) => {
    const payload = await verifyJWT(token, JWT_HOST_ACCESS_TOKEN_SECRET as string)

    return { ...payload, isHost: true }
}
  
export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookieName = ADMIN_TOKEN_COOKIE_NAME ?? "token"
      const token = req.cookies[cookieName]
      
      if (!token) {
        throw new CustomError("Unautherized access", 401)
      }

      req.context = await verifyAdminToken(token)

      if (!req.context.isAdmin) {
      throw new CustomError("Admin access required", 403)
      }

      next()
    } catch (error) {
        next(error)
    }
}

export const hostAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookieName = HOST_TOKEN_COOKIE_NAME ?? "hostToken"
      const token = req.cookies[cookieName]

      if (!token) {
        throw new CustomError("Unautherized access", 401)
      }

      req.context = await verifyHostToken(token)
  
      if (!req.context.isHost) {
        throw new CustomError("Valid external token required", 403)
      }
  
      next()
    } catch (error) {
      next(error)
    }
}

export const adminAndHostAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if admin first
      try {
        const cookieName = ADMIN_TOKEN_COOKIE_NAME ?? "token"
        const token = req.cookies[cookieName]
        if (!token) {
          throw new CustomError("Unautherized access", 401)
        }
        req.context = await verifyAdminToken(token)
      } catch (err: any) {
        // Now check if it's a host
        try {
          const cookieName = HOST_TOKEN_COOKIE_NAME ?? "hostToken"
          const hostToken = req.cookies[cookieName]
          if (!hostToken) {
            throw new CustomError("Unautherized access", 401)
          }
          
          req.context = await verifyHostToken(hostToken)
        } catch (err2: any) {
          throw new CustomError("Invalid token", 401)
        }
      }

      next()
    } catch (error) {
      next(error)
    }
}