import { config } from 'dotenv'

const envFile = ".env"
config({ path: envFile })

export const {
    PORT,
    HOST_TOKEN_COOKIE_NAME,
    JWT_HOST_ACCESS_TOKEN_SECRET,
} = process.env