import { getEventDetails, loadMapAPI } from "./utils/apis"
import fs from "fs/promises"
import path from "path"

const EVENT_ID = "b1c3d87c-e72f-45e0-9ddd-a172105477ad"

export const getMapIdFromEvent = async (eventId: string): Promise<string> => {
    try {
        const [res = null] = await getEventDetails(eventId)
        if (!res) {
            throw new Error("Event Details returnig null")
        }
        return res.mapTemplateId
        
    } catch (err: any) {
        console.error("Error fetching event details:", err.message)
        throw err
    }
}

export const initializeMapData = async () => {
    try {
        const mapId = await getMapIdFromEvent(EVENT_ID)
        

        const { images, rawData } = await loadMapAPI(mapId)

        // // Ensuring the assets directory exists
        // const assetsDir = path.join(__dirname, "assets")
        // try {
        //     await fs.access(assetsDir)
        // } catch {
        //     await fs.mkdir(assetsDir, { recursive: true })
        // }

        // const mapJsonPath = path.join(assetsDir, "map.json")
        // await fs.writeFile(mapJsonPath, JSON.stringify(rawData))

      
        // for(const image of images) {
        //     const filePath = path.join(assetsDir, image.name)

        //     // Decode the Base64 string into a Buffer
        //     const imageData = Buffer.from(image.image, "base64")
            
        //     await fs.writeFile(filePath, imageData)
        // }

    } catch (err: any) {
        console.error("Error initializing map data:", err.message)
        throw err
    }
}