/**
 * Database Initialization and Model Setup
 * Configures database connection, imports models, and handles database synchronization
 */

import { type Dialect, Sequelize } from "sequelize"
import mapModel from "./models/map.model"
import latestMapModel from "./models/latest-map.model"
import { DB_DIALECT, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from "@/config"

// Configure Sequelize with database connection and settings
const sequelize = new Sequelize(DB_NAME as string, DB_USERNAME as string, DB_PASSWORD, {
  dialect: DB_DIALECT as Dialect,
  host: DB_HOST,
  port: Number.parseInt(DB_PORT as string, 10),
  timezone: "+09:00",
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    underscored: true, // Use snake_case for column names
    freezeTableName: true, // Prevent table name pluralization
  },
  pool: {
    min: 0,
    max: 5,
  },
  benchmark: true, // Log query execution times
})

// Database object containing all models and Sequelize instances
export const DB = {
  Maps: mapModel(sequelize),
  LatestMaps: latestMapModel(sequelize),
  sequelize, // Connection instance for raw queries
  Sequelize, // Sequelize library reference
}

/**
 * Initialize database connection and synchronize models
 * Creates tables if they don't exist and establishes connection
 */
export async function initializeDatabase(): Promise<void> {
  try {
    await sequelize.authenticate()
    console.log(`Connection to ${DB_NAME} has been established successfully.`)
    await sequelize.sync({ alter: true }) // Sync models with database schema
    console.log("Database synchronized successfully.")
  } catch (err: any) {
    throw err
  }
}
