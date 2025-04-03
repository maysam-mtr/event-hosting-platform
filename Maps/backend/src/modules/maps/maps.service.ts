import { repo } from "./maps.repo"
import { CustomError } from "@/utils/Response & Error Handling/custom-error"
import type { Map } from "@/interfaces/map.interface"
import { boothesClassName, collisionsClassName, spawnLocationClassName } from "@/utils/maps.handler"
import archiver from "archiver"
import { toLower } from "lodash"
import { 
  listFolderContent,
  getFile,
  trashFileOrFolder,
  getFileByTypeFromFolder,
} from "@/utils/google-drive"
import { 
  createLatestMapService,
  deleteLatestMapService,
  getLatestMapByOriginalMapIdService,
  updateLatestMapByOriginalMapIdService,
} from "../latest-maps/latest-maps.service"
import { convertBufferToJson } from "@/utils/Helpers/helper-functions"

const getMapsService = async (): Promise<Map[]> => {
  try {
    const map = await repo.getMaps()

    if (!map) throw new CustomError("Found maps count: 0", 404)

    return map
  } catch (err: any) {
    throw new CustomError("Error fetching maps", 400)
  }
}

const getMapByIdService = async (id: string): Promise<Map | null> => {
  try {
    const res = await repo.getMapById(id)
    if (!res) {
      throw new Error()
    }
    return res
  } catch (err: any) {
    throw new CustomError("Error fetching map", 400)
  }
}

const getMapDataByIdService = async (id: string): Promise<Map & { data: Object }> => {
  try {
    const res = await repo.getMapRawById(id)
    if (!res) {
      throw new CustomError("Error fetching map", 400)
    }
    
    const { data } = await getFileByTypeFromFolder(res.folderId, "json")

    if (!data) {
      throw new Error()
    }
    
    const json = convertBufferToJson(data)

    return {
      ...res,
      data: json
    }
  } catch (err: any) {
    throw new CustomError("Error fetching map data", 400)
  }
}

const downloadMapService = async (id: string): Promise<Buffer> => {
  try {
    // Get map details
    const map = await repo.getMapById(id)
    if (!map) {
      throw new CustomError("Map not found", 404)
    }

    // Get all files in the map's folder
    const files = await listFolderContent(map.folderId!)
    if (!files || files.length === 0) {
      throw new CustomError("No files found for this map", 404)
    }

    // Create a zip archive
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    })

    // Create a buffer to store the zip file
    const chunks: Buffer[] = []
    archive.on("data", (chunk) => chunks.push(chunk))

    const archivePromise = new Promise<Buffer>((resolve, reject) => {
      archive.on("end", () => resolve(Buffer.concat(chunks)))
      archive.on("error", (err) => reject(err))
    })

    // Add each file to the archive
    for (const file of files) {
      try {
        // Get the file content
        const response = await getFile(file.id as string)

        if (response && response.data) {
          // Add the file to the archive
          archive.append(response.data, { name: file.name as string })
        }
      } catch (err: any) {
        throw new CustomError(`Error downloading file ${file.name}:`, 500)
      }
    }

    // Finalize the archive
    archive.finalize()

    // Return the zip buffer
    return await archivePromise
  } catch (err: any) {
    throw new CustomError("Error downloading map", 500)
  }
}

const createMapService = async (mapData: Map): Promise<Map> => {
  try {
    // override original map id incase present and set to null
    mapData = {
      ...mapData,
      original_map_id: null
    }
    
    const createdMap = await repo.createMap(mapData)
    if (!createdMap) {
      throw new Error()
    }
    
    const latestMap = await createLatestMapService({
      original_map_id: createdMap.id!,
      latest_map_id: createdMap.id!,
    })
    
    if (!latestMap) {
      throw new CustomError("Error adding map to the latest maps list", 404)
    }

    return createdMap
  } catch (err: any) {
    // Handle Sequelize validation errors
    if (err.errors && Array.isArray(err.errors)) {
      throw new CustomError("Validation error", 400)
    }

    if (err instanceof CustomError && err.messages[0].includes("unique constraint")) {
      throw new CustomError("Map name must be unique", 409)
    }
    throw new CustomError("Error creating map", 400)
  }
}

const updateMapService = async (id: string, mapData: Map): Promise<Map> => {
  try {

    // Create a new map entry (version) instead of updating
    const createdMap = await repo.createMap(mapData)
    
    if (!createdMap)  {
      throw new Error()
    }

    const updateRes = await updateLatestMapByOriginalMapIdService({
      original_map_id: createdMap.original_map_id!,
      latest_map_id: createdMap.id!,
    })

    if (!updateRes) {
      throw new CustomError("Error updating latest map referencing", 404)
    }
    
    const [oldMap] = await repo.updateMapUpdatedAt(id)
    
    if (!oldMap) {
      throw new CustomError("Failed to updated old map 'updated at' field", 400, oldMap)
    }

    return createdMap
  } catch (err: any) {
    
    if (err.message.includes("unique constraint")) {
      throw new CustomError("Map name must be unique", 409)
    }
    
    if (err instanceof CustomError) {
      throw err
    }
    
    throw new CustomError("Error updating map", 400, err) 
  }
}

const deleteMapService = async (id: string): Promise<number> => {
  try {
    // Get map info by id to retrieve folderId
    const map = await repo.getMapById(id)
    
    if (!map) {
      throw new CustomError("Map not found", 404)
    }
    
    // Check if the map is referenced in the latest_maps table
    const latestMapEntry = await getLatestMapByOriginalMapIdService(map.original_map_id!)
    
    if (latestMapEntry?.latest_map_id === id) {
      // Delete the related entry in the latest_maps table
      await deleteLatestMapService(latestMapEntry.id!)
    }

    // Delete the map
    var status = await repo.deleteMap(id)
    
    if (status === 0) {
      throw new CustomError("No map deleted", 404)
    }
    
    // Trash the associated folder in Google Drive
    await trashFileOrFolder(map.folderId!)
    

    // now delete all old map versions
    if (latestMapEntry?.latest_map_id === id) {
      status += await deleteMapsByOriginalMapIdService(map.original_map_id!)
    }

    return status
  } catch (err: any) {
    throw new CustomError("Error deleting map", 400)
  }
}

const deleteMapsByOriginalMapIdService = async (oid: string) : Promise<number> => {
  try {
    const oldMaps = await repo.getMapIdsByOriginalMapId(oid)
    
    var deletedMapsCnt: number = 0

    oldMaps.map(async (map) => {
      deletedMapsCnt += await repo.deleteMap(map.id!)
    })
    
    // now delete the map files from google drive
    oldMaps.map(async (map) => {
      await trashFileOrFolder(map.folderId)
    })

    return deletedMapsCnt

  } catch (err: any) {
    throw new CustomError("Error deleting map", 400)
  }
}

const getMapBoothsService = async (mapId : string) : Promise<Object[]> => {
  try {
    const map = await repo.getMapById(mapId)

    if (!map) {
      throw new CustomError("Map not found", 400)
    }

    const res = await getFileByTypeFromFolder(map.folderId, "json")
    const jsonData = JSON.parse(res.data.toString())

    return jsonData.layers
    .filter((layer: any) => 
      toLower(layer.name) === toLower(boothesClassName) ||
      toLower(layer.class) === toLower(boothesClassName)
    ).flatMap((layer: any) => {
      if (layer.layers && Array.isArray(layer.layers)) {
        return layer.layers.flatMap((subLayer: any) => {
          if (subLayer.objects && Array.isArray(subLayer.objects)) {
            return subLayer.objects
          } else {
            console.warn("Unexpected subLayer structure: missing or invalid 'objects'", subLayer)
            return []
          }
        })
      } else {
        console.warn("Unexpected layer structure: missing or invalid 'layers'", layer)
        return []
      }
    })
  } catch (err: any) {
    throw new CustomError("Error fetching map booths", 400)
  }
}

const getMapCollisionsService = async (mapId : string) : Promise<[{ 
  id: string,
  name: string,
  data: number[],
  width: number,
  height: number
}]> => {
  try {
    const map = await repo.getMapById(mapId)
    
    if (!map) {
      throw new CustomError("Map not found", 400)
    }
    
    const res = await getFileByTypeFromFolder(map.folderId, "json")
    
    const jsonData = JSON.parse(res.data.toString())
    
    return jsonData.layers
    .filter((layer: any) => 
      toLower(layer.class) === toLower(collisionsClassName) || 
      toLower(layer.name) === toLower(collisionsClassName)
    ).flatMap((layer: any) => {
      if (layer.layers && Array.isArray(layer.layers)) {
        return layer.layers.flatMap((object: any) => ({
          id: object.id,
          name: object.name,
          data: object.data,
          width: object.width,
          height: object.height,
          visible: object.visible
        }))
      } else {
        console.warn("Layer missing 'layers' property:", layer)
        return []
      }
    })
} catch (err: any) {
  throw new CustomError("Error fetching map collisions", 400)
}
}

const getMapLayersService = async (mapId : string) : Promise<[{ 
  id: string,
  name: string,
  data: number[],
  width: number,
  height: number
}]> => {
  try {
    const map = await repo.getMapById(mapId)
    
    if (!map) {
      throw new CustomError("Map not found", 400)
    }
    
    const res = await getFileByTypeFromFolder(map.folderId, "json")
    
    const jsonData = JSON.parse(res.data.toString())
    
    return jsonData.layers
    .filter((layer: any) =>
      toLower(layer.class) !== toLower(collisionsClassName) &&
      toLower(layer.name) !== toLower(collisionsClassName)
    ).flatMap((layer: any) => {
      if (layer.layers && Array.isArray(layer.layers)) {
        return layer.layers.flatMap((object: any) => ({
          id: object.id,
          name: object.name,
          data: object.data,
          width: object.width,
          height: object.height,
          visible: object.visible,
        }))
      } else {
        console.warn("Layer missing 'layers' property:", layer)
        return []
      }
    })
} catch (err: any) {
  throw new CustomError("Error fetching map layers", 400)
  }
}


const getspawnLocationService = async (mapId : string) : Promise<Object[]> => {
  try {
    const map = await repo.getMapById(mapId)

    if (!map) {
      throw new CustomError("Map not found", 400)
    }

    const res = await getFileByTypeFromFolder(map.folderId, "json")
    const jsonData = JSON.parse(res.data.toString())

    return jsonData.layers
    .filter((layer: any) =>
      toLower(layer.class) === toLower(spawnLocationClassName) ||
      toLower(layer.name) === toLower(spawnLocationClassName)
    ).flatMap((layer: any) => {
      if (layer.objects) {
        return layer.objects.map((object: any) => ({
          id: object.id,
          name: object.name,
          x: object.x,
          y: object.y
        }))
      } else {
        console.warn("Layer missing 'objects' property:", layer)
        return []
      }
    })
  } catch (err: any) {
    throw new CustomError("Error fetching map booths", 400)
  }
}
export {
  getMapsService,
  getMapByIdService,
  createMapService,
  updateMapService,
  deleteMapService,
  downloadMapService,
  deleteMapsByOriginalMapIdService,
  getMapBoothsService,
  getMapDataByIdService,
  getMapCollisionsService,
  getMapLayersService,
  getspawnLocationService,
}

