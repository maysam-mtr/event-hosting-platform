/**
 * Supabase Configuration
 *
 * This file initializes and exports the Supabase client instance used throughout the application.
 * The client is configured with environment variables for the Supabase URL and service key.
 * This configuration enables database operations and storage access for the game engine.
 */

import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

// Initialize Supabase client with URL and service key from environment variables
const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string)

export default supabase
