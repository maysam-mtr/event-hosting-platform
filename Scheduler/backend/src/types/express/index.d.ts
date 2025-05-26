/**
 * TypeScript declaration file extending Express Request interface
 *
 * Adds custom properties to the Express Request object to support
 * authentication context throughout the application.
 */
import type { JwtPayload } from "jsonwebtoken"

declare module "express-serve-static-core" {
  interface Request {
    /**
     * Authentication context added by middleware
     * Contains decoded JWT payload with user information
     */
    context?: JwtPayload
  }
}
