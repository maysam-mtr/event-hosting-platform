/**
 * External API Communication Module
 *
 * This module handles communication with external microservices:
 * - Maps API: Retrieves map data, booth configurations, and tileset images
 * - Website API: Fetches event details and partner information
 *
 * All API calls use Docker internal networking for service-to-service communication.
 * The module provides typed responses and error handling for reliable data fetching.
 */

import type { MapsApiResponse, MapResponse, WebsiteApiResponse } from "./interfaces"

// API base URLs using Docker internal networking
const MAPS_PORT = process.env.MAPS_PORT || 3000
export const MAPS_API_BASE_URL = `http://host.docker.internal:${MAPS_PORT}/api`

const WEBSITE_PORT = process.env.WEBSITE_PORT || 5000
export const WEBSITE_API_BASE_URL = `http://host.docker.internal:${WEBSITE_PORT}/api`

/**
 * Fetches complete map data including tileset images and raw map configuration
 * @param mapId - Unique identifier for the map template
 * @returns Map data containing images and configuration
 */
export const loadMapAPI = async (mapId: string): Promise<MapResponse> => {
  try {
    const res = await fetch(`${MAPS_API_BASE_URL}/maps/loadMapData/${mapId}`)
    console.log(res)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const data: MapsApiResponse = await res.json()
    return data.data
  } catch (err: any) {
    console.error("Error fetching map data:", err.message)
    throw new Error("Failed to load map data")
  }
}

/**
 * Retrieves booth configuration data for collision detection and interaction
 * @param mapId - Unique identifier for the map template
 * @returns Array of booth objects with position and dimension data
 */
export const loadBoothsAPI = async (mapId: string): Promise<MapResponse> => {
  try {
    console.log(`${MAPS_API_BASE_URL}/maps/getMapBoothsDisplay/${mapId}`)
    const res = await fetch(`${MAPS_API_BASE_URL}/maps/getMapBoothsDisplay/${mapId}`)
    console.log(res)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const data = await res.json()
    return data.data.booths
  } catch (err: any) {
    console.error("Error fetching map data:", err.message)
    throw new Error("Failed to load map data")
  }
}

/**
 * Fetches comprehensive event details including partner and booth information
 * @param eventId - Unique identifier for the event
 * @returns Event data with partner assignments and booth details
 */
export const getEventDetails = async (eventId: string): Promise<any> => {
  try {
    const res = await fetch(`${WEBSITE_API_BASE_URL}/events/booth-details/${eventId}`)
    console.log(res)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const { data }: WebsiteApiResponse = await res.json()
    return data
  } catch (err: any) {
    console.error("Error fetching event details:", err.message)
    throw new Error("Failed to load event details")
  }
}

/**
 * Retrieves booth assignment for a specific partner
 * @param eventId - Unique identifier for the event
 * @param partnerId - Unique identifier for the partner
 * @returns Booth ID assigned to the partner
 */
export const getPartnerBooth = async (eventId: string, partnerId: string): Promise<any> => {
  try {
    const res = await fetch(`${WEBSITE_API_BASE_URL}/boothDetails/partners/${eventId}/${partnerId}`)
    console.log("res", res)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const data = await res.json()
    console.log("hi", data)
    return data.data
  } catch (err: any) {
    console.error("Error fetching event details:", err.message)
    throw new Error("Failed to load event details")
  }
}
