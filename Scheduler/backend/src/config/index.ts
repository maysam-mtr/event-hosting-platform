/**
 * Configuration module for the Scheduler application
 *
 * This module loads environment variables from a .env file and exports
 * the necessary configuration values used throughout the application.
 *
 * Environment variables loaded:
 * - PORT: The port number for the server to listen on
 * - HOST_TOKEN_COOKIE_NAME: Name of the cookie used for host authentication
 * - JWT_HOST_ACCESS_TOKEN_SECRET: Secret key for signing and verifying JWT tokens
 */
import { config } from "dotenv"

// Load environment variables from .env file
const envFile = ".env"
config({ path: envFile })

// Export configuration values for use throughout the application
export const { PORT, HOST_TOKEN_COOKIE_NAME, JWT_HOST_ACCESS_TOKEN_SECRET } = process.env
