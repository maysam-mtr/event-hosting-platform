/**
 * Main Application Entry Point
 * Sets up Express server with middleware, routes, and error handling
 * Initializes database connection and starts the server
 */

import express, { type ErrorRequestHandler } from "express"
import { PORT, DB_NAME, MAP_FRONTEND_PROT, GAME_ENGINE_BACKEND_PORT, WEBSITE_FRONTEND_PORT } from "./config"
import { initializeDatabase } from "./database"
import cookieParser from "cookie-parser"
import cors from "cors"
import { errorHandler } from "@/middlewares/error.handler"
import router from "@routes/routes"

const app = express()

// CORS configuration for multiple frontend origins
const corsOptions = {
  origin: [
    `http://localhost:${MAP_FRONTEND_PROT}`,
    `http://localhost:${GAME_ENGINE_BACKEND_PORT}`,
    `http://localhost:${WEBSITE_FRONTEND_PORT}`,
  ],
  optionsSuccessStatus: 200,
  credentials: true, // Allow cookies to be sent
}

// Middleware setup
app.use(cors(corsOptions))
app.options("*", cors(corsOptions)) // Handle preflight requests for all routes
app.use(express.json()) // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(cookieParser()) // Parse cookies from requests

// API routes with /api prefix
app.use("/api", router)

// Global error handler - catches all errors passed to next(err)
app.use(errorHandler as ErrorRequestHandler)

// 404 handler for undefined routes
app.all("*", (req, res) => {
  res.status(404).json({ message: "Sorry! Page not found" })
})

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error(`Error connecting to ${DB_NAME}:`, err.message)
  })
