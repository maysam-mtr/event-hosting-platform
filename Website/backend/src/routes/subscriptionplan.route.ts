import { Router } from "express"
import {
  createSubscriptionPlanController,
  getAllSubscriptionPlanController,
} from "../controllers/subscriptionplan.controller"

/**
 * Subscription Plan Management Routes
 *
 * Manages the available subscription plans and their configurations.
 * Handles plan creation and retrieval for pricing and feature comparison.
 */
const router = Router()

// Create a new subscription plan
// Administrative endpoint for adding new pricing tiers
router.post("/add", createSubscriptionPlanController)

// Retrieve all available subscription plans
// Public endpoint for displaying pricing options to hosts
router.get("/get", getAllSubscriptionPlanController)

export default router
