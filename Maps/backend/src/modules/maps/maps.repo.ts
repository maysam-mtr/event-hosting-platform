import { DB } from '@database/index'
import { Map } from '@interfaces/map.interface'

export const repo = {
    getMaps: async (): Promise<Map[]> => {
        return await DB.Maps.findAll()
    },
    getMapById: async (id: string): Promise<Map | null> => {
        return await DB.Maps.findByPk(id)
    },
    getMapIdsByOriginalMapId: async (oid: string): Promise<Map[]> => {
        return await DB.Maps.findAll({
            where: { original_map_id: oid }
        })
    },
    createMap: async (mapData: Map): Promise<Map> => {
        return await DB.Maps.create(mapData)
    },
    updateMapUpdatedAt: async (id: string) : Promise<[number]> => {
        return await DB.Maps.update(
            { updated_at: new Date().toISOString() },
            { where: { id }}
        )
    },
    updateMap: async (id: string, mapData: Partial<Map>): Promise<[number, Map[]]> => {
        return await DB.Maps.update(mapData, {
            where: { id },
            returning: true
        })
    },
    deleteMap: async (id: string) : Promise<number> => {
        return await DB.Maps.destroy({
        where: { id }
        })
    },
}



