import { Table, Column, Model, DataType, Default, AllowNull, Unique, PrimaryKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

@Table({
  tableName: "hosts",
  modelName:"Host",
  timestamps: true, // Enable Sequelize to manage createdAt and updatedAt
})
class Host extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare fullName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare companyName: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare phoneNumber: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare companyWebsite: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare companyIndustry: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare businessRegistrationProof: string | null;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare termsAgreement: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare privacyAgreement: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

export default Host;