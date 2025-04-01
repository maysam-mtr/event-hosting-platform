import { Table, Column, Model, DataType, Default, AllowNull, Unique, PrimaryKey, CreatedAt, UpdatedAt, ForeignKey } from "sequelize-typescript";
import User from "./User"; // Import User model

@Table({
  tableName: "partners",
  modelName:"Partner",
  timestamps: true, // Enable Sequelize to manage createdAt and updatedAt
})
class Partner extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare companyName: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare companyIndustry: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare companyWebsite: string | null;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare companyLogo: string | null;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare primaryContactFullName: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare primaryContactEmail: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare primaryContactJobTitle: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare primaryContactPhoneNumber: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare companyDescription: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare linkedinLink: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare instagramLink: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare twitterLink: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare youtubeLink: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare facebookLink: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare tiktokLink: string | null;

  
  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

export default Partner;
