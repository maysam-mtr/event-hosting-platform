/**
 * Sequelize Database Configuration
 * Creates and configures the database connection using Sequelize ORM
 */

import { Sequelize } from "sequelize-typescript"
import type { Dialect } from "sequelize"
import { DB_PORT, DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_DIALECT } from "./index"

// Initialize Sequelize with database connection parameters
export const sequelize = new Sequelize(`${DB_NAME}`, `${DB_USERNAME}`, `${DB_PASSWORD}`, {
  port: Number(DB_PORT),
  host: DB_HOST,
  dialect: DB_DIALECT as Dialect,
})
