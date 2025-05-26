/**
 * Event Model
 *
 * Core entity representing virtual events in the platform
 * Contains event scheduling, configuration, and access control
 *
 * Key relationships:
 * - Belongs to a Host (event organizer)
 * - Belongs to a Subscription (defines event capabilities)
 * - Has many BoothDetails (virtual booths within event)
 * - Has one PrivateEventCredential (for private events)
 *
 * Event types:
 * - Public: Open access events
 * - Private: Invitation-only or passcode-protected events
 */

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
import Subscription from "./Subscription"

@Table({
  tableName: "events",
  modelName: "Event",
  timestamps: true,
})
class Event extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string

  // Foreign key linking to the host who created this event
  @ForeignKey(() => Host)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare hostId: string

  // Human-readable event name for display
  @AllowNull(false)
  @Column(DataType.STRING)
  declare eventName: string

  // Event access type: public (open) or private (restricted)
  @AllowNull(false)
  @Default("public")
  @Column(DataType.ENUM("public", "private"))
  declare eventType: "public" | "private"

  // Event start date (date only, time stored separately)
  @AllowNull(false)
  @Default("2025-01-01")
  @Column(DataType.DATEONLY)
  declare startDate: Date

  // Event end date (date only, time stored separately)
  @AllowNull(false)
  @Default("2025-01-01")
  @Column(DataType.DATEONLY)
  declare endDate: Date

  // Event start time (time only, date stored separately)
  @AllowNull(false)
  @Column(DataType.TIME)
  declare startTime: string

  // Event end time (time only, date stored separately)
  @AllowNull(false)
  @Column(DataType.TIME)
  declare endTime: string

  // Foreign key linking to subscription that enables this event
  @ForeignKey(() => Subscription)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare subscriptionId: string

  // Reference to map template defining event layout and design
  @AllowNull(false)
  @Column(DataType.UUID)
  declare mapTemplateId: string

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date
}

export default Event
