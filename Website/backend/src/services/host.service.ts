/**
 * Host Service
 *
 * This service handles all business logic related to host management including:
 * - Host creation with password hashing
 * - Host authentication and retrieval
 * - Host profile updates with validation
 * - Email uniqueness checks
 */

import bcrypt from "bcrypt"
import Host from "../models/Host"

/**
 * Creates a new host account with encrypted password
 * Automatically hashes the password before storing in database
 * Excludes password from returned object for security
 *
 * @param hostData - Object containing host registration information
 * @returns Host object without password field
 * @throws Error if host creation fails
 */
const createHost = async (hostData: any): Promise<any> => {
  try {
    // Hash password with salt rounds of 10 for security
    const hashedPassword = await bcrypt.hash(hostData.password, 10)

    // Create host with hashed password replacing plain text
    const host = await Host.create({ ...hostData, password: hashedPassword })

    // Remove password from response for security
    const { password, ...hostWithoutPassword } = host.toJSON()
    return hostWithoutPassword
  } catch (err) {
    throw new Error((err as Error).message || "")
  }
}

/**
 * Finds a host by their email address
 * Used primarily for authentication purposes
 *
 * @param email - Host's email address
 * @returns Host object if found
 * @throws Error if host not found
 */
const findHostByEmail = async (email: string): Promise<any> => {
  try {
    console.log("email", email)
    const host = await Host.findOne({
      where: { email: email },
    })
    if (!host) {
      throw new Error("Host not found")
    }
    console.log("host", host)
    return host
  } catch (err) {
    throw new Error((err as Error).message || "")
  }
}

/**
 * Updates host profile information with validation
 * Includes whitelist of allowed fields for security
 * Validates email uniqueness before updating
 *
 * @param hostId - Unique identifier of the host
 * @param updatedData - Partial host data to update
 * @returns Updated host object
 * @throws Error if host not found or validation fails
 */
const updateHost = async (hostId: string, updatedData: Partial<Host>): Promise<any> => {
  try {
    // Retrieve existing host record
    const host = await Host.findByPk(hostId)

    if (!host) {
      throw new Error("Host not found")
    }

    // Define allowed fields to prevent unauthorized updates
    const allowedFields = [
      "fullName",
      "companyName",
      "email",
      "phoneNumber",
      "companyWebsite",
      "companyIndustry",
      "businessRegistrationProof",
      "termsAgreement",
      "privacyAgreement",
    ]

    // Filter input to only include whitelisted fields
    const sanitizedData: Partial<Host> = {}
    for (const field of allowedFields) {
      if (field in updatedData) {
        sanitizedData[field as keyof Host] = updatedData[field as keyof Host]
      }
    }

    // Validate email uniqueness if email is being changed
    if (sanitizedData.email && sanitizedData.email !== host.email) {
      const existingHostWithEmail = await Host.findOne({
        where: { email: sanitizedData.email },
      })

      if (existingHostWithEmail) {
        throw new Error("Email already in use")
      }
    }

    // Apply updates to host record
    const updatedHost = await host.update(sanitizedData)

    return updatedHost.toJSON()
  } catch (error) {
    throw new Error((error as Error).message || "Failed to update host")
  }
}

export { findHostByEmail, createHost, updateHost }
