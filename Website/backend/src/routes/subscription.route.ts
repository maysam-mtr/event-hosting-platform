import { Router } from "express"
import { createSubscriptionController, getAllSubscriptionController } from "../controllers/subscription.controller"
import { authenticateHost } from "../middleware/authentication"

/**
 * Subscription Management Routes
 *
 * Handles host subscription purchases and subscription data retrieval.
 * Manages the relationship between hosts and their subscription plans.
 */
const router = Router()

// Create a new subscription for a host
// Requires host authentication to associate subscription with account
router.post("/new", authenticateHost, createSubscriptionController)

// Retrieve all subscription records
// Administrative endpoint for subscription overview
router.get("/get", getAllSubscriptionController)

export default router
