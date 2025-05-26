/**
 * Main Application Entry Point
 *
 * Express.js server configuration for virtual event platform API
 * Handles:
 * - Database connection initialization
 * - Middleware configuration (CORS, cookies, JSON parsing)
 * - Route registration for all API endpoints
 * - Server startup and port binding
 */

import express, { type Express, type Request, type Response } from "express"
import { connectDB } from "./config/database"

// Import all route modules
import authuserRoute from "./routes/userAuth.route"
import userRoute from "./routes/user.route"
import authhostRoute from "./routes/hostAuth.route"
import eventRoute from "./routes/event.route"
import subscriptionRoute from "./routes/subscription.route"
import subscriptionplanRoute from "./routes/subscriptionplan.route"
import invitationRoute from "./routes/invitation.route"
import boothDetailsRoute from "./routes/boothDetails.route"
import partnerRoute from "./routes/partner.route"
import hostRoute from "./routes/host.route"
import credentialRoute from "./routes/credential.route"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

/**
 * Initialize database connection
 * Establishes MySQL connection and synchronizes models
 */
const connect = async () => {
  try {
    await connectDB()
  } catch (err) {
    console.log("Database connection error:", err)
  }
}
connect()

dotenv.config()

const app: Express = express()

// Middleware Configuration
app.use(express.json()) // Parse JSON request bodies
app.use(cookieParser()) // Parse cookies for authentication

// CORS configuration for cross-origin requests
app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:5173", "http://localhost:3004"],
    credentials: true, // Allow cookies in cross-origin requests
  }),
)

// API Route Registration
app.use("/api/auth/user/", authuserRoute) // User authentication routes
app.use("/api/users", userRoute) // User management routes
app.use("/api/subscriptionplan/", subscriptionplanRoute) // Subscription plan routes
app.use("/api/subscriptions/", subscriptionRoute) // Subscription management routes
app.use("/api/events", eventRoute) // Event management routes
app.use("/api/auth/host/", authhostRoute) // Host authentication routes
app.use("/api/invitations", invitationRoute) // Invitation management routes
app.use("/api/boothDetails", boothDetailsRoute) // Booth management routes
app.use("/api/partner", partnerRoute) // Partner management routes
app.use("/api/host", hostRoute) // Host profile routes
app.use("/api/event/private/credentials", credentialRoute) // Private event credentials

// Server startup
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

// Default route for API health check
app.use("/", async (req: Request, res: Response) => {
  res.send("Welcome to the API")
})

export default app
