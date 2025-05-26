/**
 * Latest Map Model
 * Tracks the latest version of each original map for quick access
 * Maintains relationship between original maps and their current versions
 */

import type { LatestMap } from "@interfaces/latest-map.interface"
import { type Sequelize, Model, DataTypes, type Optional } from "sequelize"

// Type for creating new latest map entries (id is auto-generated)
export type LatestMapCreationAttributes = Optional<LatestMap, "id">

// Latest Map model class extending Sequelize Model
export class LatestMapModel extends Model<LatestMap, LatestMapCreationAttributes> implements LatestMap {
  public id!: string
  public original_map_id!: string // Reference to the original map
  public latest_map_id!: string // Reference to the current latest version
  public created_at: string | undefined
  public updated_at: string | undefined

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

// Model definition with table schema and configuration
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
        type: DataTypes.CHAR(36),
      },
      latest_map_id: {
        allowNull: false,
        type: DataTypes.CHAR(36),
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      tableName: "latest_maps",
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      timestamps: true,
    },
  )

  return LatestMapModel
}
