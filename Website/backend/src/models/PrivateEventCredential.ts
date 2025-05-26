/**
 * PrivateEventCredential Model
 *
 * Stores access credentials for private events
 * Manages passcode-based authentication for restricted events
 *
 * Key relationships:
 * - Belongs to an Event (one-to-one for private events)
 *
 * Security features:
 * - Passcode storage for event access control
 * - Links to specific events for validation
 * - Used for invitation-only or restricted access events
 */

import { Table, Column, Model, DataType, Default, AllowNull, PrimaryKey, ForeignKey } from "sequelize-typescript"
import Event from "./Event"

@Table({
  tableName: "private_event_credentials",
  modelName: "PrivateEventCredential",
  timestamps: true,
})
class PrivateEventCredential extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string

  // Foreign key linking to the private event
  @ForeignKey(() => Event)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare eventId: string

  // Passcode required for event access
  @AllowNull(false)
  @Column(DataType.STRING)
  declare passcode: string
}

export default PrivateEventCredential
