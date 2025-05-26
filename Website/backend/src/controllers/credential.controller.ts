/**
 * Private Event Credential Controller
 *
 * Manages access credentials for private events including:
 * - Retrieving passcodes for private events
 * - Validating event access permissions
 * - Secure credential distribution
 */

import type { Request, Response } from "express"
import { getPrivateEventCredential } from "../services/PrivateEventCredential.service"

/**
 * Retrieves the passcode for a private event
 * Used to grant access to invitation-only or restricted events
 * Returns the event passcode for authentication purposes
 */
export const getPrivateEventCredentialController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract event ID from request parameters
    const { eventId } = req.params

    // Fetch the private event passcode from database
    const passcode = await getPrivateEventCredential(eventId)

    // Return passcode for client-side event access
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Private event credential fetched successfully",
      data: {
        eventId,
        passcode,
      },
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Failed to fetch private event credential",
      errors: [{ code: "FETCH_CREDENTIAL_ERROR", message: (error as Error).message }],
    })
  }
}
