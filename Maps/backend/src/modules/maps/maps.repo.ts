/**
 * Maps Repository
 * Data access layer for map operations using Sequelize ORM
 */

import { DB } from "@database/index"
import type { Map } from "@interfaces/map.interface"

export const repo = {
  // Get all maps
  getMaps: async (): Promise<Map[]> => {
    return await DB.Maps.findAll()
  },

  // Get map by primary key
  getMapById: async (id: string): Promise<Map | null> => {
    return await DB.Maps.findByPk(id, { raw: true })
  },

  // Get all map versions by original map ID
  getMapIdsByOriginalMapId: async (oid: string): Promise<Map[]> => {
    return await DB.Maps.findAll({
      where: { original_map_id: oid },
    })
  },

  // Get raw map data by ID
  getMapRawById: async (id: string): Promise<Map | null> => {
    return await DB.Maps.findByPk(id, { raw: true })
  },

  // Create new map
  createMap: async (mapData: Map): Promise<Map> => {
    return await DB.Maps.create(mapData)
  },

  // Update map's updated_at timestamp
  updateMapUpdatedAt: async (id: string): Promise<[number]> => {
    return await DB.Maps.update({ updated_at: new Date().toISOString() }, { where: { id } })
  },

  // Update map data
  updateMap: async (id: string, mapData: Partial<Map>): Promise<[number, Map[]]> => {
    return await DB.Maps.update(mapData, {
      where: { id },
      returning: true,
    })
  },

  // Delete map
  deleteMap: async (id: string): Promise<number> => {
    return await DB.Maps.destroy({
      where: { id },
    })
  },
}
