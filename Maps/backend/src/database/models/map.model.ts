import { Map } from '@/interfaces/map.interface'
import { Sequelize, Model, DataTypes, Optional } from 'sequelize'

export type MapCreationAttributes = Optional<
    Map,
    'id' | 'original_map_id' | 'created_at' | 'updated_at'
>

export class MapModel
    extends Model<Map, MapCreationAttributes>
    implements Map
{
    public id!: string
    public original_map_id?: string | null
    public name!: string
    public folderId!: string
    public imageId!: string
    public created_at: string | undefined
    public updated_at: string | undefined

    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

export default function (sequelize: Sequelize): typeof MapModel {
    MapModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.CHAR(36),
                defaultValue: DataTypes.UUIDV4,
            },
            original_map_id: {
                allowNull: true,
                type: DataTypes.CHAR(36),
                defaultValue: null,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING(255),
                unique: {
                    name: "unique_name_constraint",
                    msg: "Map name already exists",
                },
            },
            folderId: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            imageId: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'maps',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: false,
        },
    )

    MapModel.addHook('beforeCreate', (map: MapModel) => {
        if (map.original_map_id === null) {
            map.original_map_id = map.id
        }
    })

    return MapModel
}