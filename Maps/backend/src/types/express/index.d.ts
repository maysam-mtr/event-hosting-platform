/**
 * Express Request Type Extensions
 * Adds custom properties to Express Request interface for authentication context
 */

import type { JwtPayload } from "jsonwebtoken"

declare module "express-serve-static-core" {
  interface Request {
    context?: JwtPayload // JWT payload attached by authentication middleware
  }
}
