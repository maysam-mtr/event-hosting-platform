import { getEventDetails, loadMapAPI } from "./utils/apis"
import fs from "fs/promises"
import path from "path"
import { downloadPartnerCompanyLogo } from "./utils/supabase"

// const EVENT_ID = process.env.EVENT_ID
const EVENT_ID = "653c979c-793f-4e8c-b9a9-788082b80054"

if (!EVENT_ID) {
    throw new Error("Missing EVENT_ID environment variable")
}

export const getEventInformation = async (eventId: string): Promise<{ 
    mapId: string, 
    partners: { boothId: string, userId: string, companyLogo: string }[]
}> => {
    try {
        const res = await getEventDetails(eventId)
        if (!res) {
            throw new Error("Event Details returnig null")
        }
        console.log("res:", res);
        
        // return {
        //     mapId: res.mapTemplateId,
        //     partners: [{boothId: "sdf", userId: "sdfa", companyLogo: "lskdf"}]
        // }
        const partners: { boothId: string, userId: string, companyLogo: string }[] = res[0].Partners.map((partner: any) => ({
            boothId: partner.boothTemplateId,
            userId: partner.Partner.userId,
            companyLogo: partner.Partner.companyLogo,
        }))

        return {
            mapId: res[1].mapTemplateId,
            partners
        }
        
    } catch (err: any) {
        console.error("Error fetching event details:", err.message)
        throw err
    }
}

export const initializeMapData = async () => {
    try {
        const { mapId, partners } = await getEventInformation(EVENT_ID)
        
        const { images, rawData } = await loadMapAPI(mapId)

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

        // Ensuring the partners in the assets directory exists
        const partnersDir = path.join(assetsDir, "partners")
        try {
            await fs.access(partnersDir)
        } catch (err: any) {
            await fs.mkdir(partnersDir, { recursive: true })
        }

        for(const partner of partners) {
            const filePath = path.join(partnersDir, partner.companyLogo.split('/').pop() as string)
            const logo = partner.companyLogo as string

            const imageData = await downloadPartnerCompanyLogo(logo.split('/').pop()!)

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