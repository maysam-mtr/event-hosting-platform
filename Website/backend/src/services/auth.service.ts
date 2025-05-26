import bcrypt from "bcrypt"
import { findByUsernameOrEmail } from "./user.service"
import { findHostByEmail } from "./host.service"
import type { Response } from "express"
import { findPartner } from "./partner.service"

/**
 * Authentication Service
 *
 * Handles authentication logic for both users and hosts.
 * Manages password verification, user/host lookup, and session management.
 * Integrates partner status checking for enhanced user profiles.
 */

// Authenticate user login with username/email and password
const loginUser = async ({
  usernameOrEmail,
  password,
}: { usernameOrEmail: string; password: string }): Promise<any> => {
  try {
    // Find user by username or email
    const user = await findByUsernameOrEmail(usernameOrEmail)

    if (!user) {
      throw new Error("User not found")
    }

    // Verify password against stored hash
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new Error("Incorrect password")
    }

    // Remove password from response for security
    const { password: _, ...userWithoutPassword } = user.get({ plain: true })

    // Check if user has partner status and include partner ID
    const partner = await findPartner(user.id)
    console.log("partner", partner)
    if (partner) {
      return { ...userWithoutPassword, partnerId: partner.id }
    }

    return userWithoutPassword
  } catch (err) {
    throw new Error((err as Error).message || "")
  }
}

// Authenticate host login with email and password
const loginHost = async ({ email, password }: { email: string; password: string }): Promise<any> => {
  try {
    // Find host by email address
    const host = await findHostByEmail(email)

    if (!host) {
      throw new Error("Host not found")
    }

    // Verify password against stored hash
    const isMatch = await bcrypt.compare(password, host.password)

    if (!isMatch) {
      throw new Error("Incorrect password")
    }

    // Remove password from response for security
    const { password: _, ...hostWithoutPassword } = host.get({ plain: true })

    return hostWithoutPassword
  } catch (err) {
    throw new Error((err as Error).message || "")
  }
}

// Clear user authentication token from cookies
const clearToken = (res: Response): void => {
  res.clearCookie(process.env.USER_TOKEN_COOKIE_NAME || "token", {
    httpOnly: true,
    sameSite: "strict",
  })
}

// Clear host authentication token from cookies
const clearHostToken = (res: Response): void => {
  res.clearCookie(process.env.HOST_TOKEN_COOKIE_NAME || "hostToken", {
    httpOnly: true,
    sameSite: "strict",
  })
}

export { clearHostToken, loginUser, clearToken, loginHost }
