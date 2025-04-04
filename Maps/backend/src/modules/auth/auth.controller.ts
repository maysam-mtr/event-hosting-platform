import type { NextFunction, Request, Response } from "express"
import { adminLoginService } from "./auth.service"
import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import { CustomResponse } from "@/utils/Response & Error Handling/custom-response"
import { clearToken, verifyJWT } from "@/middlewares/jwt.service"
import { ADMIN_TOKEN_COOKIE_NAME, JWT_ADMIN_ACCESS_TOKEN_SECRET } from "@/config"

export const adminLoginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // In case already logged in and trying to login again
        const cookieName = ADMIN_TOKEN_COOKIE_NAME ?? "token"
        const token = req.cookies[cookieName]
        if (token) {
            const payload = await verifyJWT(token, JWT_ADMIN_ACCESS_TOKEN_SECRET as string)
            if (payload) {
                return CustomResponse(res, 200, "Already logged in")
            }
        }
        const loginData = req.body
        const response = await adminLoginService(loginData)

        res.cookie('token', response.accessToken, {
            httpOnly: true, // prvent client-side access
            sameSite: 'strict', // prevent CSRF attacks
            maxAge: 7200000, // 2 hours,
            secure: false,
        })

        CustomResponse(res, 200, "Admin login successful")
    } catch (error) {
        next(error)
    }
}

export const checkAdminLoggedInController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // In case already logged in and trying to login again
        const cookieName = ADMIN_TOKEN_COOKIE_NAME ?? "token"
        const token = req.cookies[cookieName]
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

export const adminLogoutController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        clearToken(res)
        CustomResponse(res, 200, "Admin logout successful")
    } catch (error) {
        next(error)
    }
}

