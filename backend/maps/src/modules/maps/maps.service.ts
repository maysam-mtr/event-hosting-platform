import { repo } from "./maps.repo"
import { repo as repoLM } from "../latest-maps/latest-maps.repo"
import { CustomError } from "@/utils/custom-error"
import type { Map } from "@/interfaces/map.interface"
import { listFolderContent, getFile } from "@/utils/google-drive"
import archiver from "archiver"
import { getLatestMapByOriginalMapIdService } from "../latest-maps/latest-maps.service"

const getMapsService = async (accessToken: string): Promise<Map[]> => {
  // const decodeToken = await verifyJWT(
  //     accessToken,
  //     JWT_ACCESS_TOKEN_SECRET as string
  // )

  // const userId = decodeToken.userId

  // const map = await repo.getMaps(userId)
  const map = await repo.getMaps()

  if (!map) throw new CustomError("Found maps count: 0", 404)

  return map
}

const getMapByIdService = async (id: string, accessToken: string): Promise<Map | null> => {
  return await repo.getMapById(id)
}

const isOriginalMapIdFound = async (id: string): Promise<boolean> => {
  return (await repo.getMapById(id)) !== null
}

// Add download map service
const downloadMapService = async (id: string, accessToken: string): Promise<Buffer> => {
  try {
    // Get map details
    const map = await repo.getMapById(id)
    if (!map) {
      throw new CustomError("Map not found", 404)
    }

    // Get all files in the map's folder
    const files = await listFolderContent(map.folderId)
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
        const response = await getFile(file.id as string, true) as { data: Buffer }

        if (response && response.data) {
          // Add the file to the archive
          archive.append(response.data, { name: file.name as string })
        }
      } catch (err) {
        console.error(`Error downloading file ${file.name}:`, err)
        // Continue with other files even if one fails
      }
    }

    // Finalize the archive
    archive.finalize()

    // Return the zip buffer
    return await archivePromise
  } catch (err: any) {
    console.error("Error creating zip file:", err)
    throw err
  }
}

const createMapService = async (mapData: Map, accessToken: string): Promise<Map> => {
  try {
    if (mapData.original_map_id && !(await isOriginalMapIdFound(mapData.original_map_id))) {
      throw new CustomError("Original map not found", 404)
    }
    const createdMap = await repo.createMap(mapData)
    if (createdMap) {
      const latestMap = await repoLM.createLatestMap({
        original_map_id: createdMap.id!,
        latest_map_id: createdMap.id!,
      })
      if (!latestMap) {
        throw new CustomError("Map wasn't added to the latest maps list", 404)
      }
    }
    return createdMap
  } catch (err: any) {
    if (err instanceof CustomError && err.message.includes("unique constraint")) {
      throw new CustomError("Map name must be unique", 400)
    }
    throw err
  }
}

const updateMapService = async (id: string, mapData: Map, accessToken: string): Promise<Map> => {
  try {

    // Create a new map entry (version) instead of updating
    const createdMap = await repo.createMap(mapData)

    if (createdMap) {
      // Find the latest map entry for this original map
      const latestMapEntry = await getLatestMapByOriginalMapIdService(mapData.original_map_id!)

      if (latestMapEntry) {
        // Update the latest map reference to point to this new version
        await repoLM.updateLatestMapByOriginalMapId({
          original_map_id: mapData.original_map_id!,
          latest_map_id: createdMap.id!,
        })
      } else {
        // Create a new latest map entry if one doesn't exist
        await repoLM.createLatestMap({
          original_map_id: mapData.original_map_id!,
          latest_map_id: createdMap.id!,
        })
      }
    }
    return createdMap
  } catch (err: any) {
    if (err instanceof CustomError && err.message.includes("unique constraint")) {
      throw new CustomError("Map name must be unique", 400)
    }
    throw err
  }
}

const deleteMapService = async (id: string, accessToken: string): Promise<number> => {
  try {
    console.log("before status");
    
    const status = await repo.deleteMap(id)
    console.log("status: ", status);
    
    if (status === 0) {
      throw new CustomError("No map deleted", 404)
    }
    return status
  } catch (err: any) {
    if (err instanceof CustomError && err.message.includes("unique constraint")) {
      throw new CustomError("Map name must be unique", 400)
    }
    throw err
  }
}

export { getMapsService, getMapByIdService, createMapService, updateMapService, deleteMapService, downloadMapService }

