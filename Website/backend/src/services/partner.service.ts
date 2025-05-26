/**
 * Partner Service
 *
 * This service manages partner-related operations including:
 * - Partner profile creation and management
 * - Company information validation
 * - Partner profile updates with uniqueness checks
 * - Partner retrieval and authentication
 */

import Partner from "../models/Partner"
import { getUser } from "./user.service"

/**
 * Finds an existing partner by user ID
 * Returns 0 if no partner profile exists for the user
 *
 * @param userId - ID of the user to find partner for
 * @returns Partner object if found, 0 if not found
 * @throws Error if database query fails
 */
export const findPartner = async (userId: string): Promise<any> => {
  try {
    console.log("userid he", userId)

    // Search for partner associated with this user
    const partner = await Partner.findOne({ where: { userId } })
    console.log(partner)
    if (!partner) {
      return 0
    }
    return partner
  } catch (error) {
    throw new Error((error as Error).message || "Failed to find partner.")
  }
}

/**
 * Creates a new partner profile with company information
 * Validates user existence and enforces uniqueness constraints
 * Used when a user accepts their first invitation and becomes a partner
 *
 * @param userId - ID of the user becoming a partner
 * @param primaryContactFullName - Full name of primary contact
 * @param primaryContactEmail - Email of primary contact
 * @param companyName - Name of the partner company
 * @param companyLogo - URL to company logo image
 * @returns Created partner object
 * @throws Error if validation fails or user doesn't exist
 */
export const createPartner = async (
  userId: string,
  primaryContactFullName: string,
  primaryContactEmail: string,
  companyName: string,
  companyLogo: string,
): Promise<any> => {
  try {
    console.log("s", userId)

    // Validate that the user exists
    const user = await getUser(userId)
    if (!user) {
      throw new Error("The provided user ID does not exist")
    }

    // Ensure primary contact email is unique across all partners
    const existingEmail = await Partner.findOne({ where: { primaryContactEmail } })
    if (existingEmail) {
      throw new Error("A partner with this primary contact email already exists")
    }

    // Ensure company name is unique across all partners
    const existingCompanyName = await Partner.findOne({ where: { companyName } })
    if (existingCompanyName) {
      throw new Error("A partner with this company name already exists")
    }

    // Create partner profile with required fields
    const partner = await Partner.create({
      userId,
      primaryContactFullName,
      primaryContactEmail,
      companyName,
      companyLogo,
    })

    return partner
  } catch (error) {
    throw new Error((error as Error).message || "Failed to create partner.")
  }
}

/**
 * Updates an existing partner's profile information
 * Validates uniqueness constraints and prevents unauthorized field updates
 *
 * @param partnerId - ID of the partner to update
 * @param updatedData - Partial partner data containing fields to update
 * @returns Updated partner object
 * @throws Error if partner not found or validation fails
 */
export const updatePartner = async (partnerId: string, updatedData: Partial<Partner>): Promise<any> => {
  try {
    // Retrieve existing partner record
    const partner = await Partner.findByPk(partnerId)

    if (!partner) {
      throw new Error("Partner not found")
    }

    // Prevent updates to protected fields
    if (updatedData.id) {
      throw new Error("ID cannot be updated")
    }
    if (updatedData.userId) {
      throw new Error("User ID cannot be updated")
    }

    // Validate company name uniqueness if being changed
    if (updatedData.companyName && updatedData.companyName !== partner.companyName) {
      const existingPartnerWithCompanyName = await Partner.findOne({
        where: { companyName: updatedData.companyName },
      })

      if (existingPartnerWithCompanyName) {
        throw new Error("Company name must be unique")
      }
    }

    // Validate primary contact email uniqueness if being changed
    if (updatedData.primaryContactEmail && updatedData.primaryContactEmail !== partner.primaryContactEmail) {
      const existingPartnerWithEmail = await Partner.findOne({
        where: { primaryContactEmail: updatedData.primaryContactEmail },
      })

      if (existingPartnerWithEmail) {
        throw new Error("Primary contact email must be unique")
      }
    }

    // Apply updates to partner record
    const updatedPartner = await partner.update(updatedData)

    return updatedPartner.toJSON()
  } catch (error) {
    throw new Error((error as Error).message || "Failed to update partner")
  }
}

/**
 * Retrieves partner information by partner ID
 * Used for displaying partner profiles and company information
 *
 * @param id - The unique identifier of the partner
 * @returns Partner object with all profile information
 * @throws Error if partner not found
 */
export const getPartnerById = async (id: string): Promise<any> => {
  try {
    const partner = await Partner.findByPk(id)
    if (!partner) {
      throw new Error("Partner not found")
    }
    return partner
  } catch (error: any) {
    throw new Error(`Error fetching partner: ${error.message}`)
  }
}
