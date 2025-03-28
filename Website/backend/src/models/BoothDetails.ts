import { Table, Column, Model, DataType, Default, AllowNull, PrimaryKey, ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";
import Event from "./Event"; // Import Event model
import Partner from "./Partner"; // Import Partner model

@Table({
  tableName: "booth_details",
  modelName:"BoothDetails",
  timestamps: true, // Enable Sequelize to manage createdAt and updatedAt
})

class BoothDetails extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Event)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare eventId: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  declare boothTemplateId: string;

  @ForeignKey(() => Partner)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare partnerId: string;
  
  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

export default BoothDetails;