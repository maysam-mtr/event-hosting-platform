/**
 * Invitation Model
 *
 * Manages booth invitations sent to potential partners
 * Tracks invitation lifecycle from creation to acceptance/rejection
 *
 * Key relationships:
 * - Belongs to BoothDetails (specific booth assignment)
 *
 * Invitation lifecycle:
 * - pending: Invitation sent, awaiting response
 * - accepted: Partner accepted and joined event
 * - declined: Partner rejected invitation
 * - expired: Invitation passed expiration date
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
import BoothDetails from "./BoothDetails"

@Table({
  tableName: "invitations",
  modelName: "Invitation",
  timestamps: true, // Automatically manage createdAt and updatedAt
})
class Invitation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string

  // Foreign key linking to specific booth assignment
  @ForeignKey(() => BoothDetails)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare boothDetailsId: string

  // Email address of invited partner
  @AllowNull(false)
  @Column(DataType.STRING)
  declare assignedEmail: string

  // Current status of the invitation
  @AllowNull(false)
  @Default("pending")
  @Column(DataType.ENUM("pending", "accepted", "declined", "expired"))
  declare status: "pending" | "accepted" | "declined" | "expired"

  // Optional expiration date for invitation validity
  @AllowNull(true)
  @Column(DataType.DATEONLY)
  declare expiresAt: Date

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date
}

export default Invitation
