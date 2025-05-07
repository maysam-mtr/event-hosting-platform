import { getEventDetails, getPartnerBooth, loadBoothsAPI, loadMapAPI } from "./utils/apis"
import fs from "fs/promises"
import path from "path"

//const EVENT_ID = process.env.EVENT_ID
const EVENT_ID = "e8e8da0c-144c-4cd0-b016-00491e4eb9b3"
if (!EVENT_ID) {
    throw new Error("Missing EVENT_ID environment variable")
}

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
export const getBoothIdForPartner = async (partnerId:string): Promise<string> => {
    try {
        const [res = null] = await getPartnerBooth(EVENT_ID,partnerId)
        console.log("res in initialization",res)
        return res;
        
    } catch (err: any) {
        console.error("Error fetching event details:", err.message)
        throw err
    }
}

export const initializeMapData = async () => {
    try {
        const mapId = await getMapIdFromEvent(EVENT_ID)
        
        const { images, rawData } = await loadMapAPI(mapId)
        const boothsResponse = await loadBoothsAPI(mapId)

        const boothsJsonPath = path.join(__dirname, "assets", "booths.json")

        // Only write if file doesn't exist
        try {
          await fs.access(boothsJsonPath)
          console.log("✅ Booths file already exists")
        } catch {
          await fs.writeFile(
            boothsJsonPath,
            JSON.stringify({ booths: boothsResponse }, null, 2)
          )
          console.log("✅ Booths data saved to assets/booths.json")
        }

console.log(" Booth data saved to assets/booths.json")

        console.log("Booths data:", boothsResponse)

        const imageNames = images.map(image => ({ image: image.image, name: image.name}))
        const filePath = path.join(__dirname, "mapInfo.json")

        // if file doesn't exist -> create
        try {
            await fs.access(filePath)
        } catch (err: any) {
            await fs.writeFile(path.join(__dirname, "mapInfo.json"), JSON.stringify({ images: imageNames }))   
        }
        

        // Ensuring the assets directory exists
        const assetsDir = path.join(__dirname, "assets")
        try {
            await fs.access(assetsDir)
        } catch (err: any) {
            await fs.mkdir(assetsDir, { recursive: true })
        }

        const mapJsonPath = path.join(assetsDir, "map.json")
        // if file doesn't exsit -> create 
        try {
            await fs.access(mapJsonPath)
        } catch (err: any) {
            await fs.writeFile(mapJsonPath, JSON.stringify(rawData))
        }

      
        for(const image of images) {
            const filePath = path.join(assetsDir, image.image)

            // Decode the Base64 string into a Buffer
            const imageData = Buffer.from(image.data, "base64")
            
            // if file doesn't exist -> create
            try {
                await fs.access(filePath)
            } catch (err: any) {
                await fs.writeFile(filePath, imageData)
            }
        }

    } catch (err: any) {
        console.error("Error initializing map data:", err.message)
        throw err
    }
}