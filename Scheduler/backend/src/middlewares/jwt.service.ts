/**
 * JWT token verification service
 *
 * Provides utilities for verifying JSON Web Tokens used in authentication.
 * Handles token parsing, signature verification, and payload extraction.
 */
import jwt from "jsonwebtoken"

/**
 * Verifies a JWT token using the provided secret key
 *
 * Removes "Bearer " prefix if present and validates the token signature.
 * Returns the decoded payload for use in authentication middleware.
 *
 * @param token - JWT token string (may include "Bearer " prefix)
 * @param secretKey - Secret key used to verify the token signature
 * @returns Promise resolving to the decoded JWT payload
 * @throws Error if token verification fails or payload is invalid
 */
export const verifyJWT = async (token: string, secretKey: string): Promise<jwt.JwtPayload> => {
  try {
    // Remove Bearer prefix if present
    const cleanToken = token.replace("Bearer ", "")

    // Verify token signature and decode payload
    const data = jwt.verify(cleanToken, secretKey)

    // Ensure payload is an object, not a string
    if (typeof data === "string") throw new Error("Invalid token payload")

    return data as jwt.JwtPayload
  } catch (err: any) {
    throw new Error(err.message)
  }
}
