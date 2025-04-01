import { Table, Column, Model, DataType, Default, AllowNull, PrimaryKey, ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";
import BoothDetails from "./BoothDetails"; // Import BoothDetails model

@Table({
  tableName: "invitations",
  modelName:"Invitation",
  timestamps: true, // Enable Sequelize to manage createdAt and updatedAt
})
class Invitation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => BoothDetails)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare boothDetailsId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare assignedEmail: string;

  @AllowNull(false)
  @Default('pending')
  @Column(DataType.ENUM('pending', 'accepted', 'declined','expired'))
  declare status: 'pending' | 'accepted' | 'declined'| 'expired';

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  declare expiresAt: Date;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

export default Invitation;