import { createClient } from "@supabase/supabase-js"
import { SUPABASE_KEY, SUPABASE_URL } from "."

const supabase = createClient(
    SUPABASE_URL as string,
    SUPABASE_KEY as string
)

export default supabase