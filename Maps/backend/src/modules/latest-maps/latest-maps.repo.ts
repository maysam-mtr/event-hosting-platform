import { DB } from '@/database/index'
import { LatestMap } from '@/interfaces/latest-map.interface'

export const repo = {
    getLatestMaps: async (): Promise<LatestMap[]> => {
        return await DB.LatestMaps.findAll()
    },
    getLatestMapById: async (id: string): Promise<LatestMap | null> => {
        return await DB.LatestMaps.findByPk(id)
    },
    getLatestMapByOriginalMapId: async (id: string): Promise<LatestMap | null> => {
        return await DB.LatestMaps.findOne({ where: {original_map_id: id}})
    },
    getLatestMapByLatestMapId: async (id: string): Promise<LatestMap | null> => {
        return await DB.LatestMaps.findOne({ where: {latest_map_id: id}})
    },
    createLatestMap: async (latestMapData: LatestMap): Promise<LatestMap> => {
        return await DB.LatestMaps.create(latestMapData)
    },
    updateLatestMap: async (id: string, latestMapData: Partial<LatestMap>): Promise<[number, LatestMap[]]> => {
        return await DB.LatestMaps.update(latestMapData, {
            where: { id },
            returning: true
        })
    },
    updateLatestMapByOriginalMapId: async (latestMapData: Partial<LatestMap>): Promise<[number, LatestMap[]]> => {
        console.log("recieved:", latestMapData);
        
        return await DB.LatestMaps.update(latestMapData, {
            where: { original_map_id: latestMapData.original_map_id },
            returning: true
        })
    },
    deleteLatestMap: async (id: string): Promise<number> => {
        return await DB.LatestMaps.destroy({
            where: { id }
        })
    }
}



