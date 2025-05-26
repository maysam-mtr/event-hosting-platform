/**
 * Main Express server for the Scheduler application
 *
 * This server provides endpoints for:
 * - Scheduling game engine containers to start/stop at specific times
 * - Retrieving game engine port information for running containers
 *
 * The server uses JWT authentication for host authorization and implements
 * comprehensive error handling with custom response formatting.
 */
import express, { type ErrorRequestHandler, type NextFunction, type Request, type Response } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import http from "http"
import { errorHandler } from "./middlewares/error.handler"
import type { Schedule } from "./interfaces/schedule.interface"
import { scheduleCronJob, scheduledTasks } from "./scheduler"
import { CustomError } from "./utils/Response & Error Handling/custom-error"
import { CustomResponse } from "./utils/Response & Error Handling/custom-response"
import { hostAuthMiddleware } from "./middlewares/auth.middleware"

// Initialize Express application and HTTP server
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3333

// Configure middleware for CORS, JSON parsing, and cookie handling
app.use(
  cors({ origin: ["http://localhost:5000", "http://localhost:3004", "http://localhost:5173"], credentials: true }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

/**
 * POST /schedule
 *
 * Schedules a game engine container to start and stop at specified times.
 * Requires host authentication via JWT token in cookies.
 *
 * Request body should contain:
 * - data.eventId: Unique identifier for the event
 * - startTime: ISO string for when the container should start
 * - endTime: ISO string for when the container should stop
 *
 * Validates that:
 * - Start time is not in the past
 * - Start time is within 30 days from now
 * - Date formats are valid
 */
app.post("/schedule", hostAuthMiddleware, (req, res, next) => {
  try {
    const { data, startTime, endTime }: Schedule = req.body

    // Validate required fields
    if (!data || !data.eventId || !startTime || !endTime) {
      throw new CustomError("Failed to extracting data inorder to schedule", 400)
    }

    /**
     * Validates date constraints for scheduling
     * @param time - Date to validate
     * @returns Array of error messages, empty if valid
     */
    const dateValidation = (time: Date): string[] => {
      const now = Date.now() + 3 * 60 * 60 * 1000 // Convert to local timezone (UTC+3)
      const maxTime = now + 30 * 24 * 60 * 60 * 1000 // Maximum 30 days from now

      const errors = []

      if (isNaN(time.getTime())) {
        errors.push("Invalid date format")
      }

      if (time.getTime() < now) {
        errors.push("Start time cannot be in the past.")
      }

      if (time.getTime() > maxTime) {
        errors.push("Start time cannot exceed 30 days.")
      }
      return errors
    }

    // Parse and validate both start and end times
    const parsedStartTime = new Date(startTime)
    const parsedEndTime = new Date(endTime)

    const errors = dateValidation(parsedStartTime).concat(dateValidation(parsedEndTime))

    if (errors.length) {
      throw new CustomError("Error in the set date and time", 400, errors)
    }

    // Schedule the cron job for container management
    scheduleCronJob(data.eventId, parsedStartTime, parsedEndTime)
    CustomResponse(res, 200, "Successfully scheduled event start")
  } catch (err: any) {
    next(err)
  }
})

/**
 * GET /getGameEnginePort/:id
 *
 * Retrieves the host port number for a running game engine container.
 * Used by clients to connect to the appropriate game engine instance.
 *
 * @param id - Event ID to look up the container port
 * @returns Object containing the hostPort number
 */
app.get("/getGameEnginePort/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = req.params.id
    const entry = scheduledTasks[eventId]

    // Check if container is running and has an assigned port
    if (!entry || !entry.hostPort) {
      throw new CustomError("Game Engine not running or port not found", 404)
    }

    CustomResponse(res, 200, "Game Engine port available", {
      hostPort: entry.hostPort,
    })
  } catch (err: any) {
    next(err)
  }
})

// Apply global error handling middleware
app.use(errorHandler as ErrorRequestHandler)

// Catch-all route for undefined endpoints
app.all("/", (req: Request, res: Response) => {
  res.status(404).json({ message: "Sorry! Page not found" })
})

// Start the server
server.listen(PORT, () => {
  console.log(`Scheduler running on port ${PORT}`)
})
