import { Table, Column, Model, DataType, Default, AllowNull,Unique, PrimaryKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

@Table({
  tableName: "users",
  modelName:"User",
  timestamps: true, // Enable Sequelize to manage createdAt and updatedAt
})
class User extends Model {
  
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
   declare id:string;


  @AllowNull(false)
  @Column(DataType.STRING)
  declare fullName: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare username: string;

  @Unique
  @AllowNull(false)
  @Column( DataType.STRING)
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare isPartner: number;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare profilePic: string | null;

  @AllowNull(false)
  @Default("1989-03-27")
  @Column(DataType.DATEONLY)
  declare dateOfBirth: Date;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare country: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare educationLevel: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare fieldOfStudy: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare preferredEventType: string | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare yearsOfExperience: number | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare linkedin: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare github: string | null;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

export default User;