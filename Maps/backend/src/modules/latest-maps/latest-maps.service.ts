import { repo } from "./latest-maps.repo"
import { repo as mapRepo } from "../maps/maps.repo"
import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import type { LatestMap } from "@/interfaces/latest-map.interface"
import type { Map } from "@/interfaces/map.interface"
import { getMapBoothsService } from "../maps/maps.service"

const getLatestMapsService = async (): Promise<LatestMap[]> => {
  try {
    const latestMap = await repo.getLatestMaps()

    if (!latestMap) throw new CustomError("Found maps count: 0", 404)

    return latestMap
  } catch (err: any) {
    throw new CustomError("Error fetching latest maps", 404)
  }
}

type MapWithBooths = Map & { booths: number }

const getLatestMapsWithDetailsService = async (): Promise<MapWithBooths[]> => {
  try {
    const latestMaps = await repo.getLatestMaps()

    if (!latestMaps || latestMaps.length === 0) throw new CustomError("Found maps count: 0", 404)

    // Get the actual map details for each latest map
    const mapDetails: MapWithBooths[] = []
    for (const latestMap of latestMaps) {
      const map = await mapRepo.getMapById(latestMap.latest_map_id)
      if (map) {
        const mapBooths = await getMapBoothsService(map.id as string)
        const mapWithBooths: MapWithBooths = {
          id: map.id,
          name: map.name,
          imageId: map.imageId,
          updated_at: map.updated_at,
          folderId: map.folderId,
          booths: mapBooths.length 
        }
        mapDetails.push(mapWithBooths)
      }
    }

    return mapDetails
  } catch (err: any) {
    throw new CustomError("Error fetching detailed latest map", 404)
  }
}

const getLatestMapByIdService = async (id: string): Promise<LatestMap | null> => {
  try {
    return await repo.getLatestMapById(id)
  } catch (err: any) {
    throw new CustomError("Error fetching latest map", 404)
  }
}

const createLatestMapService = async (mapData: LatestMap): Promise<LatestMap> => {
  try {
    return await repo.createLatestMap(mapData)
  } catch (err: any) {
    throw new CustomError("Error creating latest map", 404)
  }
}

const deleteLatestMapService = async (id: string): Promise<number> => {
  try {
    const status = await repo.deleteLatestMap(id)
    if (status === 0) {
      throw new CustomError("No map referencing deleted", 404)
    }
    return status
  } catch (err: any) {
    throw new CustomError("Error deleting latest map", 404)
  }
}

const getLatestMapByOriginalMapIdService = async (original_map_id: string) : Promise<LatestMap | null> => {
  try {
    return await repo.getLatestMapByOriginalMapId(original_map_id)
  } catch (err: any) {
    throw new CustomError("Error fetching latest map", 404)
  }
}

const updateLatestMapByOriginalMapIdService = async (data: Partial<LatestMap>): Promise<[number, LatestMap[]]> => {
  try {
    const [affectedRows, updatedMaps] = await repo.updateLatestMapByOriginalMapId(data)
    if (affectedRows === 0) {
      throw new CustomError("Latest map ID not found", 404)
    }

    if (updatedMaps.length === 0) {
      throw new CustomError("No changes made to the latest map", 400)
    }

    return [affectedRows, updatedMaps]
  } catch (err: any) {
    throw new CustomError("Error updating latest map", 404)
  }
}

export {
  getLatestMapsService,
  getLatestMapsWithDetailsService,
  getLatestMapByIdService,
  createLatestMapService,
  deleteLatestMapService,
  getLatestMapByOriginalMapIdService,
  updateLatestMapByOriginalMapIdService,
}

