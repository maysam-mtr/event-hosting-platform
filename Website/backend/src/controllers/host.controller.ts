/**
 * Host Controller
 *
 * Manages host account operations including:
 * - Host registration and account creation
 * - Host profile updates and management
 * - Authentication state validation
 * - Business information management
 */

import type { Request, Response } from "express"
import { validationResult } from "express-validator"
import { createHost, updateHost } from "../services/host.service"
import { sendResponse } from "../Utils/responseHelper"

/**
 * Creates a new host account for event organizers
 * Validates that user is not already logged in to prevent duplicate accounts
 */
const createHostController = async (req: Request, res: Response): Promise<void> => {
  console.log("hi", (req as any).hostUser)

  // Prevent account creation if user is already authenticated
  if ((req as any).hostUser) {
    sendResponse(
      res,
      false,
      403,
      "You are already logged in and cannot create a new account.",
      [],
      [{ code: "HOST_LOGIN_ERROR", message: "You are already logged in and cannot create a new account." }],
    )
    return
  }

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

  try {
    const host = req.body
    // Create new host account with business information
    const newHost = await createHost(host)
    sendResponse(res, true, 200, "Host created successfully", [{ newHost }])
    return
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Internal Server Error",
      [],
      [{ code: "CREATE_HOST_ERROR", message: (err as Error).message }],
    )
    return
  }
}

/**
 * Updates existing host profile information
 * Allows hosts to modify their business details and contact information
 */
const updateHostController = async (req: Request, res: Response): Promise<void> => {
  try {
    const hostId = (req as any).hostUser?.id

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

    const updatedData = req.body

    // Update host profile with new information
    const updatedHost = await updateHost(hostId, updatedData)

    // Return updated host information
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Host updated successfully",
      data: updatedHost,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Failed to update host",
      errors: [{ code: "UPDATE_HOST_ERROR", message: (error as Error).message }],
    })
  }
}

export { createHostController, updateHostController }
