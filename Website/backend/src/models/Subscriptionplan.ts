import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  AllowNull,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript"

/**
 * Subscription Plan Model
 *
 * Defines the different subscription tiers available for hosts.
 * Each plan has specific limitations on event duration, number of rooms/booths,
 * and pricing information.
 */
@Table({
  tableName: "Subscriptionplan",
  modelName: "Subscriptionplan",
  timestamps: true, // Automatically manages createdAt and updatedAt fields
})
class Subscriptionplan extends Model {
  // Unique identifier for each subscription plan
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string

  // Name of the subscription plan (e.g., "Basic", "Premium", "Enterprise")
  @AllowNull(false)
  @Column(DataType.STRING)
  declare planName: string

  // Cost of the subscription plan in decimal format
  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare price: number

  // Maximum number of booths/rooms allowed in events for this plan
  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare nbOfRooms: number

  // Maximum event duration allowed in minutes
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare maxDuration: number

  // Timestamp when the plan was created
  @CreatedAt
  declare createdAt: Date

  // Timestamp when the plan was last updated
  @UpdatedAt
  declare updatedAt: Date
}

export default Subscriptionplan
