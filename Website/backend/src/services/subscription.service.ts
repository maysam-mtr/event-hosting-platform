/**
 * Subscription Service
 *
 * This service manages subscription operations for hosts, including creating subscriptions,
 * validating subscription status, tracking usage, and managing subscription plans.
 * Subscriptions have a 30-day validity period and can only be used once.
 */

import Subscription from "../models/Subscription"
import Subscriptionplan from "../models/Subscriptionplan"

/**
 * Creates a new subscription for a host
 * @param {any} subscriptionData - The subscription data containing planId
 * @param {string} hostId - The unique identifier of the host
 * @returns {Promise<any>} The created subscription object
 * @throws {Error} If subscription creation fails
 */
const createSubscription = async (subscriptionData: any, hostId: string): Promise<any> => {
  try {
    const { planId } = subscriptionData
    const event = await Subscription.create({
      hostId,
      planId,
    })
    return event.toJSON()
  } catch (err) {
    throw new Error((err as Error).message || "")
  }
}

/**
 * Retrieves all subscription plans available in the system
 * @returns {Promise<any>} Array of all subscription plans
 * @throws {Error} If retrieval fails
 */
const getSubscriptionPlans = async (): Promise<any> => {
  try {
    const subscriptionplans = await Subscription.findAll()
    return subscriptionplans
  } catch (err) {
    throw new Error((err as Error).message || "")
  }
}

/**
 * Marks a subscription as used (consumed) after event creation
 * @param {string} subscriptionId - The unique identifier of the subscription
 * @returns {Promise<void>}
 * @throws {Error} If subscription is not found or update fails
 */
const markSubscriptionAsUsed = async (subscriptionId: string): Promise<void> => {
  try {
    const subscription = await Subscription.findByPk(subscriptionId)
    if (subscription) {
      await subscription.update({ isUsed: 1 })
      console.log(`Subscription ${subscriptionId} marked as used.`)
    } else {
      throw new Error(`Subscription with ID ${subscriptionId} not found.`)
    }
  } catch (err) {
    console.error("Error updating subscription:", err)
    throw new Error((err as Error).message || "Failed to update subscription.")
  }
}

/**
 * Validates if a subscription is still valid for use
 * Checks if subscription exists, is within 30-day window, and hasn't been used
 * @param {string} subscriptionId - The unique identifier of the subscription
 * @param {string} hostId - The unique identifier of the host
 * @returns {Promise<{isValid: boolean; message: string}>} Validation result with status message
 * @throws {Error} If validation check fails
 */
const isSubscriptionValid = async (
  subscriptionId: string,
  hostId: string,
): Promise<{ isValid: boolean; message: string }> => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        id: subscriptionId,
        hostId: hostId,
      },
    })

    if (!subscription) {
      return {
        isValid: false,
        message: "No subscriptions",
      }
    }

    // Calculate expiration date (30 days from creation)
    const createdAt = new Date(subscription.createdAt)
    const expirationDate = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)

    const now = new Date()
    if (now <= expirationDate && subscription.isUsed === 0) {
      return {
        isValid: true,
        message: "Subscription is valid",
      }
    } else if (now > expirationDate) {
      return {
        isValid: false,
        message: "Subscription has expired",
      }
    } else if (subscription.isUsed === 1) {
      return {
        isValid: false,
        message: "Subscription has already been used",
      }
    }

    return {
      isValid: false,
      message: "Invalid subscription status",
    }
  } catch (error) {
    throw new Error((error as Error).message || "Failed to check subscription validity.")
  }
}

import { getNumberOfRoomsByPlanId } from "./subscriptionplan.service"

/**
 * Retrieves the number of booths allowed for a specific subscription
 * @param {string} subscriptionId - The unique identifier of the subscription
 * @returns {Promise<number>} The number of booths allowed
 * @throws {Error} If subscription or plan is not found
 */
export const getNumberOfBooths = async (subscriptionId: string): Promise<number> => {
  try {
    const subscription1 = await Subscription.findByPk(subscriptionId)

    if (!subscription1) {
      throw new Error("Subscription or subscription plan not found")
    }
    return await getNumberOfRoomsByPlanId(subscription1.planId)
  } catch (error) {
    throw new Error((error as Error).message || "Failed to fetch number of rooms")
  }
}

/**
 * Retrieves the maximum duration allowed for events under a specific subscription
 * @param {string} subscriptionId - The unique identifier of the subscription
 * @returns {Promise<number>} The maximum duration in the unit defined by the plan
 * @throws {Error} If subscription or plan is not found
 */
export const getMaxDurationBySubscriptionId = async (subscriptionId: string): Promise<number> => {
  try {
    const subscription = await Subscription.findByPk(subscriptionId, {
      attributes: ["planId"],
    })

    if (!subscription) {
      throw new Error("Subscription not found.")
    }

    const { planId } = subscription

    const subscriptionPlan = await Subscriptionplan.findByPk(planId, {
      attributes: ["maxDuration"],
    })

    if (!subscriptionPlan) {
      throw new Error("Subscription plan not found.")
    }

    const { maxDuration } = subscriptionPlan

    return maxDuration
  } catch (error) {
    console.error("Error in getMaxDurationBySubscriptionId:", error)
    throw new Error((error as Error).message || "Failed to retrieve maximum duration.")
  }
}

export { createSubscription, getSubscriptionPlans, markSubscriptionAsUsed, isSubscriptionValid }
