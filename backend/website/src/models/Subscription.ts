import { Table, Column, Model, DataType, Default, AllowNull, PrimaryKey, ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";
import Host from "./Host"; // Import Host model
import Subscriptionplan from "./Subscriptionplan"; // Import Subscriptionplan model

@Table({
  tableName: "subscriptions",
  modelName:"Subscription",
  timestamps: true, // Enable Sequelize to manage createdAt and updatedAt
})
class Subscription extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Host)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare hostId: string;

  @ForeignKey(() => Subscriptionplan)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare planId: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare isUsed: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

export default Subscription;
