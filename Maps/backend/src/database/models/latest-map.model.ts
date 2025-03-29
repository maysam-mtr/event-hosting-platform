import { LatestMap } from "@interfaces/latest-map.interface";
import { Sequelize, Model, DataTypes, Optional } from "sequelize";

export type LatestMapCreationAttributes = Optional<
    LatestMap,
    'id'
>

export class LatestMapModel
    extends Model<LatestMap, LatestMapCreationAttributes>
    implements LatestMap
{
    public id!: string
    public original_map_id!: string
    public latest_map_id!: string
    public created_at: string | undefined
    public updated_at: string | undefined

    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

export default function (sequelize: Sequelize): typeof LatestMapModel {
    LatestMapModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.CHAR(36),
                defaultValue: DataTypes.UUIDV4,
            },
            original_map_id: {
                allowNull: false,
                type: DataTypes.CHAR(36)
            },
            latest_map_id: {
                allowNull: false,
                type: DataTypes.CHAR(36),
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'latest_maps',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    )

    return LatestMapModel
}