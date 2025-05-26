/**
 * Supabase Client Configuration
 * Initializes Supabase client for storage operations (file uploads/downloads)
 */

import { createClient } from "@supabase/supabase-js"
import { SUPABASE_KEY, SUPABASE_URL } from "."

// Create Supabase client instance
const supabase = createClient(SUPABASE_URL as string, SUPABASE_KEY as string)

export default supabase
