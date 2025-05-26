/**
 * Game Engine Initialization Module
 *
 * This module handles the initial setup and data loading for the game engine:
 * - Fetches event details and partner information from external APIs
 * - Downloads and caches map data, booth configurations, and partner assets
 * - Creates local file structure for game assets
 * - Manages partner booth assignments and company logo downloads
 *
 * The initialization process ensures all required data is available locally
 * before the game server starts accepting connections.
 */

import { getEventDetails, getPartnerBooth, loadBoothsAPI, loadMapAPI } from "./utils/apis"
import fs from "fs/promises"
import path from "path"
import { downloadPartnerCompanyLogo } from "./utils/supabase"
import type { Partner, EventDetails } from "./utils/interfaces"

// Event ID from environment variables - identifies which event this game engine serves
const EVENT_ID = process.env.EVENT_ID

if (!EVENT_ID) {
  throw new Error("Missing EVENT_ID environment variable")
}

/**
 * Retrieves comprehensive event information including map and partner data
 * @param eventId - The unique identifier for the event
 * @returns Event details containing map ID and partner information
 */
export const getEventInformation = async (eventId: string): Promise<EventDetails> => {
  try {
    const res = await getEventDetails(eventId)
    if (!res) {
      throw new Error("Event Details returning null")
    }

    // Transform partner data into required format
    const partners: Partner[] = res[0].Partners.map((partner: any) => ({
      boothId: partner.boothTemplateId,
      userId: partner.Partner.userId,
      companyLogo: partner.Partner.companyLogo,
    }))

    return {
      mapId: res[1].mapTemplateId,
      partners,
    }
  } catch (err: any) {
    console.error("Error fetching event details:", err.message)
    throw err
  }
}

/**
 * Retrieves the booth ID assigned to a specific partner
 * @param partnerId - The unique identifier for the partner
 * @returns The booth ID assigned to the partner
 */
export const getBoothIdForPartner = async (partnerId: string): Promise<string> => {
  try {
    const [res = null] = await getPartnerBooth(EVENT_ID, partnerId)
    console.log("res in initialization", res)
    return res
  } catch (err: any) {
    console.error("Error fetching event details:", err.message)
    throw err
  }
}

/**
 * Main initialization function that sets up all game data and assets
 * This function:
 * - Downloads map data and booth configurations
 * - Creates local asset directories
 * - Saves map images and booth data to local files
 * - Downloads partner company logos
 * - Creates JSON configuration files for the game engine
 */
export const initializeMapData = async () => {
  try {
    const { mapId, partners } = await getEventInformation(EVENT_ID)

    // Load map data and booth configurations from external APIs
    const { images, rawData } = await loadMapAPI(mapId)
    const boothsResponse = await loadBoothsAPI(mapId)

    // Create assets directory structure
    const assetsDir = path.join(__dirname, "assets")
    try {
      await fs.access(assetsDir)
    } catch (err: any) {
      await fs.mkdir(assetsDir, { recursive: true })
    }

    // Save booth configuration data
    const boothsJsonPath = path.join(assetsDir, "booths.json")
    try {
      await fs.access(boothsJsonPath)
      console.log("✅ Booths file already exists")
    } catch {
      await fs.writeFile(boothsJsonPath, JSON.stringify({ booths: boothsResponse }, null, 2))
      console.log("✅ Booths data saved to assets/booths.json")
    }

    console.log("Booth data saved to assets/booths.json")
    console.log("Booths data:", boothsResponse)

    // Process and save map image information
    const imageNames = images.map((image) => ({ image: image.image, name: image.name }))
    const filePath = path.join(__dirname, "mapInfo.json")

    // Create map info file if it doesn't exist
    try {
      await fs.access(filePath)
    } catch (err: any) {
      await fs.writeFile(path.join(__dirname, "mapInfo.json"), JSON.stringify({ images: imageNames }))
    }

    // Save raw map data
    const mapJsonPath = path.join(assetsDir, "map.json")
    try {
      await fs.access(mapJsonPath)
    } catch (err: any) {
      await fs.writeFile(mapJsonPath, JSON.stringify(rawData))
    }

    // Save map image files from base64 data
    for (const image of images) {
      const filePath = path.join(assetsDir, image.image)
      const imageData = Buffer.from(image.data, "base64")

      // Only create file if it doesn't already exist
      try {
        await fs.access(filePath)
      } catch (err: any) {
        await fs.writeFile(filePath, imageData)
      }
    }

    // Create partners directory for company logos
    const partnersDir = path.join(assetsDir, "partners")
    try {
      await fs.access(partnersDir)
    } catch (err: any) {
      await fs.mkdir(partnersDir, { recursive: true })
    }

    // Download and save partner company logos
    for (const partner of partners) {
      const logo = partner.companyLogo
        .split((process.env.SUPABASE_PARTNERS_BUCKET_NAME || "eventure-imgs") + "/")
        .pop()!
      const logoFileName = partner.companyLogo.split("/").pop()!
      const localFileNameWithoutExt = path.parse(logoFileName).base

      const filePath = path.join(partnersDir, logoFileName)
      const imageData = await downloadPartnerCompanyLogo(logo)

      // Save logo file if it doesn't exist
      try {
        await fs.access(filePath)
      } catch (err: any) {
        await fs.writeFile(filePath, imageData)
      }

      // Update partner data with local file path
      partner.companyLogo = localFileNameWithoutExt
    }

    // Save partners configuration file
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
