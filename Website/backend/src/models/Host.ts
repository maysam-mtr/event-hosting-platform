/**
 * Host Model
 *
 * Represents event organizers who create and manage virtual events
 * Contains business information and contact details for event hosts
 *
 * Key relationships:
 * - Has many Subscriptions (for event creation capabilities)
 * - Has many Events (events they organize)
 *
 * Business features:
 * - Company registration and verification
 * - Industry classification
 * - Terms and privacy agreement tracking
 */

import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  AllowNull,
  Unique,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript"

@Table({
  tableName: "hosts",
  modelName: "Host",
  timestamps: true, // Automatically manage createdAt and updatedAt
})
class Host extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string

  // Host's full name for identification
  @AllowNull(false)
  @Column(DataType.STRING)
  declare fullName: string

  // Company or organization name
  @AllowNull(false)
  @Column(DataType.STRING)
  declare companyName: string

  // Unique email address for authentication and communication
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare email: string

  // Contact phone number
  @AllowNull(false)
  @Column(DataType.STRING)
  declare phoneNumber: string

  // Encrypted password for authentication
  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string

  // Optional company website URL
  @AllowNull(true)
  @Column(DataType.STRING)
  declare companyWebsite: string | null

  // Industry classification for business categorization
  @AllowNull(true)
  @Column(DataType.STRING)
  declare companyIndustry: string | null

  // Business registration documentation for verification
  @AllowNull(true)
  @Column(DataType.TEXT)
  declare businessRegistrationProof: string | null

  // Terms of service agreement status
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare termsAgreement: boolean

  // Privacy policy agreement status
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare privacyAgreement: boolean

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date
}

export default Host
