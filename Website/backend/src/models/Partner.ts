/**
 * Partner Model
 *
 * Represents companies/organizations that participate in virtual events
 * Contains comprehensive business profile and contact information
 *
 * Key relationships:
 * - Belongs to a User (one-to-one relationship)
 * - Has many BoothDetails (booths they operate in events)
 *
 * Business profile features:
 * - Company information and branding
 * - Contact details and social media presence
 * - Industry classification and descriptions
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
  ForeignKey,
} from "sequelize-typescript"
import User from "./User"

@Table({
  tableName: "partners",
  modelName: "Partner",
  timestamps: true, // Automatically manage createdAt and updatedAt
})
class Partner extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string

  // Foreign key linking to associated user account
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string

  // Unique company name for identification
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare companyName: string

  // Industry classification for categorization
  @AllowNull(true)
  @Column(DataType.STRING)
  declare companyIndustry: string

  // Company website URL
  @AllowNull(true)
  @Column(DataType.STRING)
  declare companyWebsite: string | null

  // Company logo image URL or path
  @AllowNull(false)
  @Column(DataType.STRING)
  declare companyLogo: string | null

  // Primary contact person's full name
  @AllowNull(false)
  @Column(DataType.STRING)
  declare primaryContactFullName: string

  // Primary contact email (unique for communication)
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare primaryContactEmail: string

  // Primary contact's job title/position
  @AllowNull(true)
  @Column(DataType.STRING)
  declare primaryContactJobTitle: string

  // Primary contact's phone number
  @AllowNull(true)
  @Column(DataType.STRING)
  declare primaryContactPhoneNumber: string

  // Detailed company description for profiles
  @AllowNull(true)
  @Column(DataType.TEXT)
  declare companyDescription: string | null

  // Social media profile links for company presence
  @AllowNull(true)
  @Column(DataType.STRING)
  declare linkedinLink: string | null

  @AllowNull(true)
  @Column(DataType.STRING)
  declare instagramLink: string | null

  @AllowNull(true)
  @Column(DataType.STRING)
  declare twitterLink: string | null

  @AllowNull(true)
  @Column(DataType.STRING)
  declare youtubeLink: string | null

  @AllowNull(true)
  @Column(DataType.STRING)
  declare facebookLink: string | null

  @AllowNull(true)
  @Column(DataType.STRING)
  declare tiktokLink: string | null

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date
}

export default Partner
