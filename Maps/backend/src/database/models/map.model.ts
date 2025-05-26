/**
 * Map Model
 * Represents map entities in the database with versioning support
 * Handles map file references and automatic ID assignment
 */

import type { Map } from "@/interfaces/map.interface"
import { type Sequelize, Model, DataTypes, type Optional } from "sequelize"

// Type for creating new maps (auto-generated fields are optional)
export type MapCreationAttributes = Optional<Map, "id" | "original_map_id" | "created_at" | "updated_at">

// Map model class extending Sequelize Model
export class MapModel extends Model<Map, MapCreationAttributes> implements Map {
  public id!: string
  public original_map_id?: string | null // Links to original version for map history
  public name!: string // Human-readable map name
  public folderId!: string // Google Drive folder ID containing map files
  public imageId!: string // Supabase storage ID for map thumbnail
  public created_at: string | undefined
  public updated_at: string | undefined

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

// Model definition with schema, hooks, and constraints
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
      tableName: "maps",
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      timestamps: false,
    },
  )

  // Pre-creation hook to set original_map_id and format imageId
  MapModel.addHook("beforeCreate", (map: MapModel) => {
    // Set original map ID to current map ID if not specified (for new original maps)
    if (map.original_map_id === null) {
      map.original_map_id = map.id
    }

    // Standardize image file extension using map ID
    const extension = map.imageId.split(".").pop()
    const imageId = `${map.id}.${extension}`
    map.imageId = imageId
  })

  return MapModel
}
