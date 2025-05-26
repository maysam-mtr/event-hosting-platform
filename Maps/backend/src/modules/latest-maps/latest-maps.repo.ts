/**
 * Latest Maps Repository
 * Data access layer for latest map operations using Sequelize ORM
 */

import { DB } from "@/database/index"
import type { LatestMap } from "@/interfaces/latest-map.interface"

export const repo = {
  // Retrieve all latest map records
  getLatestMaps: async (): Promise<LatestMap[]> => {
    return await DB.LatestMaps.findAll()
  },

  // Find latest map by primary key
  getLatestMapById: async (id: string): Promise<LatestMap | null> => {
    return await DB.LatestMaps.findByPk(id)
  },

  // Find latest map by original map ID
  getLatestMapByOriginalMapId: async (id: string): Promise<LatestMap | null> => {
    return await DB.LatestMaps.findOne({ where: { original_map_id: id } })
  },

  // Find latest map by current latest map ID
  getLatestMapByLatestMapId: async (id: string): Promise<LatestMap | null> => {
    return await DB.LatestMaps.findOne({ where: { latest_map_id: id } })
  },

  // Create new latest map record
  createLatestMap: async (latestMapData: LatestMap): Promise<LatestMap> => {
    return await DB.LatestMaps.create(latestMapData)
  },

  // Update latest map by ID
  updateLatestMap: async (id: string, latestMapData: Partial<LatestMap>): Promise<[number, LatestMap[]]> => {
    return await DB.LatestMaps.update(latestMapData, {
      where: { id },
      returning: true,
    })
  },

  // Update latest map by original map ID
  updateLatestMapByOriginalMapId: async (latestMapData: Partial<LatestMap>): Promise<[number, LatestMap[]]> => {
    return await DB.LatestMaps.update(latestMapData, {
      where: { original_map_id: latestMapData.original_map_id },
      returning: true,
    })
  },

  // Delete latest map record
  deleteLatestMap: async (id: string): Promise<number> => {
    return await DB.LatestMaps.destroy({
      where: { id },
    })
  },
}
