/**
 * Partner Controller
 *
 * Manages partner account operations including:
 * - Partner profile updates and information management
 * - Company details and contact information
 * - Social media links and business descriptions
 * - Partner data retrieval for event participation
 */

import type { Request, Response } from "express"
import { validationResult } from "express-validator"
import { getPartnerById, updatePartner } from "../services/partner.service"
import { sendResponse } from "../Utils/responseHelper"

/**
 * Updates existing partner profile information
 * Allows partners to modify company details, contact info, and social media links
 */
export const updatePartnerController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request data
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      sendResponse(
        res,
        false,
        400,
        "Validation Failed",
        [],
        [{ code: "VALIDATION_ERROR", message: errors.array()[0].msg }],
      )
      return
    }

    // Extract partner ID and updated information
    const { partnerId } = req.params
    const updatedData = req.body

    // Ensure at least one field is being updated
    if (updatedData.length === 0) {
      sendResponse(
        res,
        false,
        400,
        "At least one valid field must be provided for update.",
        [],
        [{ code: "INVALID_INPUT", message: "No valid fields provided for update." }],
      )
      return
    }

    // Update partner profile with new information
    const updatedPartner = await updatePartner(partnerId, updatedData)

    // Return updated partner data
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Partner updated successfully",
      data: updatedPartner,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Failed to update partner",
      errors: [{ code: "UPDATE_PARTNER_ERROR", message: (error as Error).message }],
    })
  }
}

/**
 * Retrieves detailed information for a specific partner
 * Returns comprehensive partner profile including company and contact details
 */
export const getPartnerByIdController = async (req: any, res: any): Promise<void> => {
  try {
    const { id } = req.params

    // Fetch complete partner information
    const partner = await getPartnerById(id)

    res.status(200).json({
      success: true,
      data: partner,
    })
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    })
  }
}
