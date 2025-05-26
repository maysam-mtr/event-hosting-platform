/**
 * Authentication Service
 * Contains business logic for admin authentication operations
 */

import { ADMIN_USERNAME, ADMIN_PASSWORD, JWT_ADMIN_ACCESS_TOKEN_SECRET } from "@/config"
import { generateJWT } from "@/middlewares/jwt.service"
import { CustomError } from "@/utils/Response & Error Handling/custom-error"

/**
 * Admin Login Service
 * Validates admin credentials and generates JWT token
 * @param loginData - Object containing username and password
 * @returns User data and access token
 */
export const adminLoginService = async (loginData: { username: string; password: string }) => {
  try {
    // Validate admin credentials against environment variables
    if (loginData.username !== ADMIN_USERNAME || loginData.password !== ADMIN_PASSWORD) {
      throw new CustomError("Invalid admin credentials", 401)
    }

    // Create JWT payload
    const payload = {
      username: loginData.username,
      role: "admin",
    }

    // Generate access token
    const accessToken = await generateJWT(payload, JWT_ADMIN_ACCESS_TOKEN_SECRET as string)

    return {
      user: {
        username: loginData.username,
        role: "admin",
      },
      accessToken,
    }
  } catch (err: any) {
    throw new CustomError("An error occurred during admin login", 500, err)
  }
}
