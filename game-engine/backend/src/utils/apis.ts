import { MapsApiResponse, MapResponse, WebsiteApiResponse } from "./interfaces"

const MAPS_PORT = process.env.MAPS_PORT || 3000
export const MAPS_API_BASE_URL = `https://mapsback.eventurelb.online/api`

const WEBSITE_PORT = process.env.WEBSITE_PORT || 5000
export const WEBSITE_API_BASE_URL = `https://website.eventurelb.online/api`


export const loadMapAPI = async (mapId: string): Promise<MapResponse> => {
  try {
    const res = await fetch(`${MAPS_API_BASE_URL}/maps/loadMapData/${mapId}`)
    console.log(res)
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

export const loadBoothsAPI = async (mapId: string): Promise<MapResponse> => {
  try {
    console.log(`${MAPS_API_BASE_URL}/maps/getMapBoothsDisplay/${mapId}`)
    const res = await fetch(`${MAPS_API_BASE_URL}/maps/getMapBoothsDisplay/${mapId}`)
    console.log(res)
    // Check if the response is successful
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    // Parse the response body
    const data = await res.json()
    return data.data.booths
    
  } catch (err: any) {
    console.error("Error fetching map data:", err.message)
    throw new Error("Failed to load map data")
  }
}

export const getEventDetails = async (eventId: string): Promise<any> => {
  try {
    const res = await fetch(`${WEBSITE_API_BASE_URL}/events/booth-details/${eventId}`)
    
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
export const getPartnerBooth = async (eventId: string,partnerId:string): Promise<any> => {
  try {
    const res = await fetch(`${WEBSITE_API_BASE_URL}/boothDetails/partners/${eventId}/${partnerId}`)
    console.log("res",res)
    // Check if the response is successful
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    // Parse the response body
    const data = await res.json()
    console.log("hi",data)
    return data.data
    
  } catch (err: any) {
    console.error("Error fetching event details:", err.message)
    throw new Error("Failed to load event details")
  }
}