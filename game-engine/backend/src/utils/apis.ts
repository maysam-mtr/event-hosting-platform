import { MapsApiResponse, MapResponse, WebsiteApiResponse } from "./interfaces"

const MAPS_PORT = process.env.MAPS_PORT || 3000
export const MAPS_API_BASE_URL = `http://host.docker.internal:${MAPS_PORT}/api`

const WEBSITE_PORT = process.env.WEBSITE_PORT || 5000
export const WEBSITE_API_BASE_URL = `http://host.docker.internal:${WEBSITE_PORT}/api`


export const loadMapAPI = async (mapId: string): Promise<MapResponse> => {
  try {
    const res = await fetch(`${MAPS_API_BASE_URL}/maps/loadMapData/${mapId}`)
    
    // Check if the response is successful
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    // Parse the response body
    const data: MapsApiResponse = await res.json()
    return data.data
    
  } catch (err: any) {
    console.error("Error fetching map data:", err.message)
    throw new Error("Failed to load map data")
  }
}

export const getEventDetails = async (eventId: string): Promise<any> => {
  try {
    const res = await fetch(`${WEBSITE_API_BASE_URL}/events/booth-details/${eventId}`)
    // const res = await fetch(`${WEBSITE_API_BASE_URL}/events/details/${eventId}`)
    
    
    // Check if the response is successful
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    // Parse the response body
    const { data }: WebsiteApiResponse = await res.json()
    return data
    
  } catch (err: any) {
    console.error("Error fetching event details:", err.message)
    throw new Error("Failed to load event details")
  }
}