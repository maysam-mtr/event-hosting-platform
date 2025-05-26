/**
 * Subscription Controller
 *
 * Manages host subscription operations including:
 * - Creating new subscriptions for hosts
 * - Linking subscriptions to subscription plans
 * - Retrieving available subscription plans
 * - Managing subscription lifecycle
 */

import type { Request, Response } from "express"
import { createSubscription, getSubscriptionPlans } from "../services/subscription.service"
import { sendResponse } from "../Utils/responseHelper"

/**
 * Creates a new subscription for a host
 * Links host to a specific subscription plan for event creation capabilities
 */
const createSubscriptionController = async (req: Request, res: Response): Promise<void> => {
  const subscriptionData = req.body
  const hostUser = (req as any).hostUser

  try {
    console.log("hostUser", hostUser)

    // Create subscription record linking host to plan
    const subscription = await createSubscription(subscriptionData, hostUser.id)

    sendResponse(res, true, 201, "Subscription created successfully", subscription)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to create subscription",
      [],
      [{ code: "CREATE_SUBSCRIPTION_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Retrieves all available subscription plans
 * Provides hosts with subscription options and pricing information
 */
const getAllSubscriptionController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all subscription plan options
    const subscriptionPlans = await getSubscriptionPlans()

    sendResponse(res, true, 200, "Subscriptions returned successfully", subscriptionPlans)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to get subscription",
      [],
      [{ code: "GET_SUBSCRIPTION_ERROR", message: (err as Error).message }],
    )
  }
}

export { createSubscriptionController, getAllSubscriptionController }
