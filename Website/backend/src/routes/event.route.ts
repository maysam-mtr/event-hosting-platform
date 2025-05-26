import { Router } from "express"
import {
  createEventController,
  updateEventController,
  getPublicEventsController,
  getEventDetailsController,
  joinEventController,
  getEventsForHostController,
  filterEventsByStatusController,
  getBoothDetailsForEventController,
  getBoothPartnersForEventController,
} from "../controllers/event.controller"
import { authenticateHost } from "../middleware/authentication"
import { createEventValidation, updateEventValidation } from "../validation/event.validator"

/**
 * Event Management Routes
 *
 * Comprehensive event management system handling event creation, updates,
 * public event browsing, event joining, and host-specific event operations.
 * Supports both public and private events with different access controls.
 */
const router = Router()

// Create a new event (hosts only)
// Validates event data and requires host authentication
router.post("/create", authenticateHost, createEventValidation(), createEventController)

// Update an existing event (hosts only)
// Allows modification of event details by the event owner
router.put("/update/:eventId", authenticateHost, updateEventValidation(), updateEventController)

// Retrieve all public events available for browsing
// No authentication required for public event discovery
router.get("/public", getPublicEventsController)

// Get detailed information about a specific event
// Available for both public and private events
router.get("/details/:eventId", getEventDetailsController)

// Get booth configuration details for an event
// Used for event layout and booth management
router.get("/booth-details/:eventId", getBoothDetailsForEventController)

// Get all partners participating in an event (hosts only)
// Provides host with overview of event participants
router.get("/booth-partner/:eventId", authenticateHost, getBoothPartnersForEventController)

// Join an event (requires passcode for private events)
// Validates access and allows users to enter events
router.post("/:eventId/join", joinEventController)

// Retrieve all events created by a specific host
// Host dashboard functionality for event management
router.get("/hosts/:hostId", getEventsForHostController)

// Filter host's events by status (past, ongoing, future)
// Helps hosts organize and manage their event portfolio
router.post("/filter/:hostId", filterEventsByStatusController)

export default router
