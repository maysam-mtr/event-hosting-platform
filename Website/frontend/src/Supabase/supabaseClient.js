/**
 * Supabase Client Configuration
 *
 * Initializes and configures the Supabase client:
 * - Sets up connection to Supabase backend services
 * - Configures authentication and storage settings
 * - Provides centralized client instance for the application
 * - Manages API keys and connection parameters
 * - Handles client-side Supabase service integration
 *
 * Central configuration point for all Supabase services
 * used throughout the application.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);