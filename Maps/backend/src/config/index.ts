/**
 * Environment Configuration
 * Centralized configuration file that loads and exports all environment variables
 * Used throughout the application for consistent access to configuration values
 */

import { config } from "dotenv"

// Load development environment variables
const envFile = ".env.development"
config({ path: envFile })

// Backend server configuration
export const { PORT, NODE_ENV, BASE_URL } = process.env

// Database connection settings
export const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_DIALECT } = process.env

// Admin authentication configuration
export const { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_TOKEN_COOKIE_NAME, JWT_ADMIN_ACCESS_TOKEN_SECRET } = process.env

// Host role authentication configuration
export const { HOST_TOKEN_COOKIE_NAME, JWT_HOST_ACCESS_TOKEN_SECRET } = process.env

// User role authentication configuration
export const { USER_TOKEN_COOKIE_NAME, JWT_USER_ACCESS_TOKEN_SECRET } = process.env

// Google Drive integration settings
export const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_PROJECT_ID,
  GOOGLE_MAPS_FOLDER_ID,
} = process.env

// Supabase storage configuration
export const { BUCKET_NAME, SUPABASE_URL, SUPABASE_KEY } = process.env

// CORS allowed origins configuration
export const { MAP_FRONTEND_PROT, GAME_ENGINE_BACKEND_PORT, WEBSITE_FRONTEND_PORT } = process.env
