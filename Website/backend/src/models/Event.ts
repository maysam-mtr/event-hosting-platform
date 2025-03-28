import { Table, Column, Model, DataType, Default, AllowNull, PrimaryKey, ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";
import Host from "./Host"; // Import Host model
import Subscription from "./Subscription"; 

@Table({
  tableName: "events",
  modelName:"Event",
  timestamps: true,
})
class Event extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Host)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare hostId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare eventName: string;

  @AllowNull(false)
  @Default('public')
  @Column(DataType.ENUM('public', 'private'))
  declare eventType: 'public' | 'private';


  @AllowNull(false)
  @Column(DataType.DATEONLY)
  declare eventDate: Date;

  @AllowNull(false)
  @Column(DataType.TIME)
  declare eventTime: string;

  @ForeignKey(() => Subscription)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare subscriptionId: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  declare mapTemplateId: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

export default Event;