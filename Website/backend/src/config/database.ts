/**
 * Database Configuration and Connection Setup
 *
 * This file configures the Sequelize ORM connection to MySQL database and defines
 * all model associations for the virtual event platform. It handles:
 * - Database connection establishment
 * - Model registration and synchronization
 * - Relationship definitions between entities
 */

import { Sequelize } from "sequelize-typescript"
import dotenv from "dotenv"
// Import all database models
import User from "../models/User"
import Host from "../models/Host"
import Partner from "../models/Partner"
import Subscription from "../models/Subscription"
import Subscriptionplan from "../models/Subscriptionplan"
import Event from "../models/Event"
import BoothDetails from "../models/BoothDetails"
import Invitation from "../models/Invitation"
import PrivateEventCredential from "../models/PrivateEventCredential"

dotenv.config()

// Initialize Sequelize with MySQL connection parameters
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [
    User,
    Host,
    Partner,
    Subscription,
    Subscriptionplan,
    Event,
    BoothDetails,
    Invitation,
    PrivateEventCredential,
  ],
  logging: false, // Disable SQL query logging in console
})

/**
 * Establishes database connection and defines all model relationships
 * Sets up the complete data model for the virtual event platform
 */
export const connectDB = async () => {
  try {
    // Test database connection
    await sequelize.authenticate()
    console.log("Database connected successfully!")

    // Define all model associations after Sequelize initialization

    // User-Partner relationship (One-to-One)
    User.hasOne(Partner, { foreignKey: "userId" })
    Partner.belongsTo(User, { foreignKey: "userId" })

    // Host-Subscription relationship (One-to-Many)
    Host.hasMany(Subscription, { foreignKey: "hostId" })
    Subscription.belongsTo(Host, { foreignKey: "hostId" })

    // Host-Event relationship (One-to-Many)
    Host.hasMany(Event, { foreignKey: "hostId" })
    Event.belongsTo(Host, { foreignKey: "hostId" })

    // Subscription-Event relationship (One-to-One)
    Subscription.hasOne(Event, { foreignKey: "subscriptionId" })
    Event.belongsTo(Subscription, { foreignKey: "subscriptionId" })

    // SubscriptionPlan-Subscription relationship (One-to-Many)
    Subscriptionplan.hasMany(Subscription, { foreignKey: "planId" })
    Subscription.belongsTo(Subscriptionplan, { foreignKey: "planId" })

    // Event-BoothDetails relationship (One-to-Many)
    Event.hasMany(BoothDetails, { foreignKey: "eventId" })
    BoothDetails.belongsTo(Event, { foreignKey: "eventId" })

    // Event-PrivateEventCredential relationship (One-to-One)
    Event.hasOne(PrivateEventCredential, { foreignKey: "eventId" })
    PrivateEventCredential.belongsTo(Event, { foreignKey: "eventId" })

    // Partner-BoothDetails relationship (One-to-Many)
    Partner.hasMany(BoothDetails, { foreignKey: "partnerId" })
    BoothDetails.belongsTo(Partner, { foreignKey: "partnerId" })

    // BoothDetails-Invitation relationship (One-to-Many)
    BoothDetails.hasMany(Invitation, { foreignKey: "boothDetailsId" })
    Invitation.belongsTo(BoothDetails, { foreignKey: "boothDetailsId" })

    // Synchronize database schema with models
    await sequelize.sync()
    await Subscriptionplan.sync({ alter: true })
    console.log("Database synchronized!")
  } catch (error) {
    console.error("Database connection failed:", error)
    process.exit(1)
  }
}

export default sequelize
