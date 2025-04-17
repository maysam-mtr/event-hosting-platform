/// <reference path="../types/express/index.d.ts" />

import { verifyJWT } from "./jwt.service"
import { JWT_HOST_ACCESS_TOKEN_SECRET, HOST_TOKEN_COOKIE_NAME } from "@/config/index"
import { CustomError } from "@/utils/Response & Error Handling/custom-errorutils/Response & Error Handling/custom-error"
import { NextFunction, Request, Response } from "express"

const verifyHostToken = async (token: string) => {
    const payload = await verifyJWT(token, JWT_HOST_ACCESS_TOKEN_SECRET as string)

    return { ...payload, isHost: true }
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