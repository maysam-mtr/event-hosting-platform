import { Table, Column, Model, DataType, Default, AllowNull, Unique, PrimaryKey, CreatedAt, UpdatedAt, ForeignKey } from "sequelize-typescript";
import Event from "./Event";

@Table({
  tableName: "private_event_credentials",
  modelName: "PrivateEventCredential",
  timestamps: true,
})
class PrivateEventCredential extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Event)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare eventId: string; // Links to the Event table

  @AllowNull(false)
  @Column(DataType.STRING)
  declare passcode: string; // Passcode for the private event


}

export default PrivateEventCredential;