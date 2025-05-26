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

/**
 * User Model
 *
 * Represents regular users of the platform who can attend events and potentially
 * become partners. Contains personal information, preferences, and professional details.
 * Users can be upgraded to partner status when they accept event invitations.
 */
@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true, // Automatically manages createdAt and updatedAt fields
})
class User extends Model {
  // Unique identifier for each user
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  // User's full name for display purposes
  @AllowNull(false)
  @Column(DataType.STRING)
  declare fullName: string

  // Unique username for login and identification
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare username: string

  // Unique email address for login and communication
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare email: string

  // Hashed password for authentication
  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string

  // Flag indicating if user has partner privileges
  // 0 = regular user, 1 = partner
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare isPartner: number

  // URL or path to user's profile picture
  @AllowNull(true)
  @Column(DataType.TEXT)
  declare profilePic: string | null

  // User's date of birth for demographic purposes
  @AllowNull(false)
  @Default("1989-03-27")
  @Column(DataType.DATEONLY)
  declare dateOfBirth: Date

  // User's country of residence
  @AllowNull(true)
  @Column(DataType.STRING)
  declare country: string | null

  // User's highest level of education
  @AllowNull(true)
  @Column(DataType.STRING)
  declare educationLevel: string | null

  // User's field of study or specialization
  @AllowNull(true)
  @Column(DataType.STRING)
  declare fieldOfStudy: string | null

  // User's preferred type of events to attend
  @AllowNull(true)
  @Column(DataType.STRING)
  declare preferredEventType: string | null

  // User's years of professional experience
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare yearsOfExperience: number | null

  // User's LinkedIn profile URL
  @AllowNull(true)
  @Column(DataType.STRING)
  declare linkedin: string | null

  // User's GitHub profile URL
  @AllowNull(true)
  @Column(DataType.STRING)
  declare github: string | null

  // Timestamp when the user account was created
  @CreatedAt
  declare createdAt: Date

  // Timestamp when the user account was last updated
  @UpdatedAt
  declare updatedAt: Date
}

export default User
