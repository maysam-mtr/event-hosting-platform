import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  AllowNull,
  PrimaryKey,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript"
import Host from "./Host"
import Subscriptionplan from "./Subscriptionplan"

/**
 * Subscription Model
 *
 * Represents the relationship between hosts and their subscription plans.
 * Tracks which subscription plan a host has purchased and whether it has been used.
 * Each subscription can only be used once to create an event.
 */
@Table({
  tableName: "subscriptions",
  modelName: "Subscription",
  timestamps: true, // Automatically manages createdAt and updatedAt fields
})
class Subscription extends Model {
  // Unique identifier for each subscription
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string

  // Reference to the host who owns this subscription
  @ForeignKey(() => Host)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare hostId: string

  // Reference to the subscription plan details
  @ForeignKey(() => Subscriptionplan)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare planId: string

  // Flag indicating if this subscription has been used to create an event
  // 0 = unused, 1 = used
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare isUsed: number

  // Timestamp when the subscription was created
  @CreatedAt
  declare createdAt: Date

  // Timestamp when the subscription was last updated
  @UpdatedAt
  declare updatedAt: Date
}

export default Subscription
