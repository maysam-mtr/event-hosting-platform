/**
 * TypeScript Interface Definitions
 *
 * This module defines all TypeScript interfaces used throughout the application:
 * - API response structures for consistent data handling
 * - Game entity definitions (players, maps, booths)
 * - External service response formats
 * - Event and partner data structures
 *
 * These interfaces ensure type safety and consistent data structures across
 * all modules and API interactions.
 */

// Standard API response structure used across all endpoints
export interface ApiResponse<T = any> {
  statusCode: number
  messages: string[]
  data: T | null
  errors: any | null
}

// Map image data structure containing base64 encoded image data
export interface Image {
  image: string // Filename of the image
  name: string // Display name for the image
  data: string // Base64 encoded image data
}

// Map response structure containing images and raw map configuration
export interface MapResponse {
  images: Image[] // Array of map tileset images
  rawData: Object // Raw map configuration data
}

// Player entity structure for tracking game state
export interface Player {
  id: string // Unique player identifier
  position: { x: number; y: number } // Player position coordinates
}

// Maps API response structure
export interface MapsApiResponse<T = any> {
  statusCode: number
  messages: string[]
  data: T | null
  errors: any | null
}

// Website API response structure
export interface WebsiteApiResponse {
  success: boolean
  status: number
  message: string
  data: []
  error: []
}

// Partner entity structure for booth assignments
export interface Partner {
  boothId: string // ID of the booth assigned to this partner
  userId: string // Unique user identifier for the partner
  companyLogo: string // URL or path to company logo image
}

// Event details structure containing map and partner information
export interface EventDetails {
  mapId: string // Unique identifier for the event's map template
  partners: Partner[] // Array of partners participating in the event
}
