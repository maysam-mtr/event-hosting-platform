import { repo } from "./latest-maps.repo"
import { repo as mapRepo } from "../maps/maps.repo"
import { CustomError } from "@/utils/custom-error"
import type { LatestMap } from "@/interfaces/latest-map.interface"
import type { Map } from "@/interfaces/map.interface"

const getLatestMapsService = async (accessToken: string): Promise<LatestMap[]> => {
  const latestMap = await repo.getLatestMaps()

  if (!latestMap) throw new CustomError("Found maps count: 0", 404)

  return latestMap
}

const getLatestMapsWithDetailsService = async (accessToken: string): Promise<Map[]> => {
  const latestMaps = await repo.getLatestMaps()

  if (!latestMaps || latestMaps.length === 0) throw new CustomError("Found maps count: 0", 404)

  // Get the actual map details for each latest map
  const mapDetails: Map[] = []
  for (const latestMap of latestMaps) {
    const map = await mapRepo.getMapById(latestMap.latest_map_id)
    if (map) {
      mapDetails.push(map)
    }
  }

  return mapDetails
}

const getLatestMapByIdService = async (id: string, accessToken: string): Promise<LatestMap | null> => {
  return await repo.getLatestMapById(id)
}

const isOriginalLatestMapIdFound = async (id: string): Promise<boolean> => {
  return (await repo.getLatestMapById(id)) !== null
}

const createLatestMapService = async (mapData: LatestMap, accessToken: string): Promise<LatestMap> => {
  try {
    if (mapData.original_map_id && !(await isOriginalLatestMapIdFound(mapData.original_map_id))) {
      throw new CustomError("Latest map not found", 404)
    }
    return await repo.createLatestMap(mapData)
  } catch (err: any) {
    throw err
  }
}

const updateLatestMapService = async (
  id: string,
  mapData: Partial<LatestMap>,
  accessToken: string,
): Promise<[number, LatestMap[]]> => {
  try {
    if (mapData.original_map_id && !(await isOriginalLatestMapIdFound(mapData.original_map_id))) {
      throw new CustomError("Latest map not found", 404)
    }

    const [affectedRows, updatedMaps] = await repo.updateLatestMap(id, mapData)
    if (affectedRows === 0) {
      throw new CustomError("Latest map ID not found", 404)
    }

    if (updatedMaps.length === 0) {
      throw new CustomError("No changes made to the latest map", 400)
    }

    return [affectedRows, updatedMaps]
  } catch (err: any) {
    throw err
  }
}

const deleteLatestMapService = async (id: string, accessToken: string): Promise<number> => {
  try {
    const status = await repo.deleteLatestMap(id)
    if (status === 0) {
      throw new CustomError("No map referencing deleted", 404)
    }
    return status
  } catch (err: any) {
    throw err
  }
}

const getLatestMapByOriginalMapIdService = async (original_map_id: string) : Promise<LatestMap | null> => {
  try {
    return await repo.getLatestMapByOriginalMapId(original_map_id)
  } catch (err) {
    throw err
  }
}

export {
  getLatestMapsService,
  getLatestMapsWithDetailsService,
  getLatestMapByIdService,
  createLatestMapService,
  updateLatestMapService,
  deleteLatestMapService,
  getLatestMapByOriginalMapIdService,
}

