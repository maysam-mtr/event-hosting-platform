/**
 * Subscription Plan Controller
 *
 * Manages subscription plan operations including:
 * - Creating new subscription plans with pricing and features
 * - Retrieving available subscription plans for hosts
 * - Managing plan details and capabilities
 * - Plan configuration for different host tiers
 */

import type { Request, Response } from "express"
import { createSubscriptionPlan, getSubscriptionPlans } from "../services/subscriptionplan.service"
import { sendResponse } from "../Utils/responseHelper"

/**
 * Creates a new subscription plan
 * Defines pricing, features, and limitations for host subscriptions
 */
const createSubscriptionPlanController = async (req: Request, res: Response): Promise<void> => {
  const planData = req.body

  try {
    // Create new subscription plan with specified features and pricing
    const subscriptionPlan = await createSubscriptionPlan(planData)

    sendResponse(res, true, 201, "Subscription plan created successfully", subscriptionPlan)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to create subscription plan",
      [],
      [{ code: "CREATE_SUBSCRIPTIONPLAN_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Retrieves all available subscription plans
 * Returns complete list of subscription options with pricing and features
 */
const getAllSubscriptionPlanController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all subscription plans for display to potential subscribers
    const subscriptionPlans = await getSubscriptionPlans()

    sendResponse(res, true, 200, "Subscription plans returned successfully", subscriptionPlans)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to get subscription plans",
      [],
      [{ code: "GET_SUBSCRIPTIONPLANS_ERROR", message: (err as Error).message }],
    )
  }
}

export { createSubscriptionPlanController, getAllSubscriptionPlanController }
