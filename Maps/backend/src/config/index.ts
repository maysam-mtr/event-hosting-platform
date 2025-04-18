import { config } from 'dotenv'

const envFile = ".env.development"
config({ path: envFile })

// Backend server
export const {
    PORT,
    NODE_ENV,
    BASE_URL,
} = process.env

// Database
export const {
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_HOST,
    DB_DIALECT,
} = process.env

// Admin
export const {
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
    ADMIN_TOKEN_COOKIE_NAME,
    JWT_ADMIN_ACCESS_TOKEN_SECRET,
} = process.env

// HOST
export const {
    HOST_TOKEN_COOKIE_NAME,
    JWT_HOST_ACCESS_TOKEN_SECRET,
} = process.env

// USER
export const {
    USER_TOKEN_COOKIE_NAME,
    JWT_USER_ACCESS_TOKEN_SECRET,
} = process.env

// Google Drive
export const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_REFRESH_TOKEN,
    GOOGLE_PROJECT_ID,
    GOOGLE_MAPS_FOLDER_ID,
} = process.env

// Supabase
export const {
    BUCKET_NAME,
    SUPABASE_URL,
    SUPABASE_KEY,
} = process.env

// CORS
export const {
    MAP_FRONTEND_PROT,
    GAME_ENGINE_PORT,
} = process.env