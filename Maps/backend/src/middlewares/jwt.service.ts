/**
 * JWT Token Service
 * Handles creation, verification, and management of JWT authentication tokens
 */

import { ADMIN_TOKEN_COOKIE_NAME } from "@/config"
import type { Response } from "express"
import jwt from "jsonwebtoken"

/**
 * Generate JWT token with Bearer prefix
 * @param payload - Data to encode in the token
 * @param secretKey - Secret key for signing the token
 * @returns Promise resolving to Bearer token string
 */
export const generateJWT = async (payload: any, secretKey: string) => {
  try {
    const token = `Bearer ${jwt.sign(payload, secretKey)}`
    return token
  } catch (err: any) {
    throw new Error(err.message)
  }
}

/**
 * Verify and decode JWT token
 * @param token - Token string to verify (with or without Bearer prefix)
 * @param secretKey - Secret key used to sign the token
 * @returns Promise resolving to decoded token payload
 */
export const verifyJWT = async (token: string, secretKey: string): Promise<jwt.JwtPayload> => {
  try {
    // Remove Bearer prefix if present
    const cleanToken = token.replace("Bearer ", "")
    const data = jwt.verify(cleanToken, secretKey)

    if (typeof data === "string") throw new Error("Invalid token payload")

    return data as jwt.JwtPayload
  } catch (err: any) {
    throw new Error(err.message)
  }
}

/**
 * Clear authentication token from response cookies
 * @param res - Express response object
 */
export const clearToken = (res: Response) => {
  try {
    res.clearCookie(ADMIN_TOKEN_COOKIE_NAME as string, {
      httpOnly: true,
      sameSite: "strict",
    })
  } catch (err: any) {
    throw new Error("Error clearing out token")
  }
}
