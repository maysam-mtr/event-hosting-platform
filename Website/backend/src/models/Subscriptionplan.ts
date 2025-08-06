import { Table, Column, Model, DataType, Default, AllowNull, PrimaryKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

@Table({
  tableName: "subscriptionplan",
  modelName:"Subscriptionplan",
  timestamps: true, // Enable Sequelize to manage createdAt and updatedAt
})
class Subscriptionplan extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare planName: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare price: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare nbOfRooms: number;

  @AllowNull(false)
  @Column(DataType.INTEGER) 
  declare maxDuration: number; // Duration in minutes

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

export default Subscriptionplan;
