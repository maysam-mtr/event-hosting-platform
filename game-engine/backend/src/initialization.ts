import { getEventDetails, getPartnerBooth, loadBoothsAPI, loadMapAPI } from "./utils/apis"
import fs from "fs/promises"
import path from "path"
import { downloadPartnerCompanyLogo } from "./utils/supabase"
import { Partner, EventDetails } from "./utils/interfaces"

const EVENT_ID = process.env.EVENT_ID
// const EVENT_ID = "f64968a1-2c75-4b5d-89cb-f234d4900be4"
if (!EVENT_ID) {
    throw new Error("Missing EVENT_ID environment variable")
}

export const getEventInformation = async (eventId: string): Promise<EventDetails> => {
    try {
        const res = await getEventDetails(eventId)
        if (!res) {
            throw new Error("Event Details returnig null")
        }

        const partners: Partner[] = res[0].Partners.map((partner: any) => ({
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
        const { mapId, partners } = await getEventInformation(EVENT_ID)
        
        const { images, rawData } = await loadMapAPI(mapId)
        const boothsResponse = await loadBoothsAPI(mapId)

        // Ensuring the assets directory exists
        const assetsDir = path.join(__dirname, "assets")
        try {
            await fs.access(assetsDir)
        } catch (err: any) {
            await fs.mkdir(assetsDir, { recursive: true })
        }

        const boothsJsonPath = path.join(assetsDir, "booths.json")

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
            const logo = partner.companyLogo.split((process.env.SUPABASE_PARTNERS_BUCKET_NAME || "eventure-imgs") + "/").pop()!
            const logoFileName = partner.companyLogo.split('/').pop()!
            const localFileNameWithoutExt = path.parse(logoFileName).base
            
            const imageData = await downloadPartnerCompanyLogo(logo)

            // if file doesn't exist -> create
            try {
                await fs.access(logoFileName)
            } catch (err: any) {
                await fs.writeFile(logoFileName, imageData)
            }
            
            
            // Update partner company logo path
            partner.companyLogo = localFileNameWithoutExt
        }
        
        // if file doesn't exist -> create
        const partnersFilePath = path.join(__dirname, "partners.json")
        try {
            await fs.access(partnersFilePath)
        } catch {
            await fs.writeFile(partnersFilePath, JSON.stringify(partners))
        }

    } catch (err: any) {
        console.error("Error initializing map data:", err.message)
        throw err
    }
}