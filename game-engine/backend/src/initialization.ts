import { getEventDetails, loadMapAPI } from "./utils/apis"
import fs from "fs/promises"
import path from "path"
import { downloadPartnerCompanyLogo, extractSupabaseFilePath } from "./utils/supabase"

const EVENT_ID = process.env.EVENT_ID
// const EVENT_ID = "2db1109e-9f42-4c27-b4af-9f147bf18180"

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
            await fs.writeFile(path.join(__dirname, "mapInfo.json"), JSON.stringify(imageNames))   
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

        for (const partner of partners) {
            const logoSupabasePath = extractSupabaseFilePath(partner.companyLogo)
            const logoFileName = partner.companyLogo.split('/').pop()!
            const localFileNameWithoutExt = path.parse(logoFileName).base

            if (!logoSupabasePath) {
                console.warn(`Unable to extract logo image path from: ${partner.companyLogo}`)
                continue
            }

            const filePath = path.join(partnersDir, logoFileName)
            const imageData = await downloadPartnerCompanyLogo(logoSupabasePath)

            try {
                await fs.access(filePath)
            } catch {
                await fs.writeFile(filePath, imageData)
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