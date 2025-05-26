/**
 * BoothDetails Model
 *
 * Represents virtual booth configurations within events
 * Links partners to specific booth templates in events
 *
 * Key relationships:
 * - Belongs to an Event (many booths per event)
 * - Belongs to a Partner (partner can have multiple booths)
 * - References booth template for visual/functional configuration
 * - Connected to Invitations for booth assignment
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
import Event from "./Event"
import Partner from "./Partner"

@Table({
  tableName: "booth_details",
  modelName: "BoothDetails",
  timestamps: true, // Automatically manage createdAt and updatedAt
})
class BoothDetails extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string

  // Foreign key linking to the event containing this booth
  @ForeignKey(() => Event)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare eventId: string

  // Reference to booth template defining appearance and functionality
  @AllowNull(false)
  @Column(DataType.UUID)
  declare boothTemplateId: string

  // Foreign key linking to the partner operating this booth
  @ForeignKey(() => Partner)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare partnerId: string

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date
}

export default BoothDetails
