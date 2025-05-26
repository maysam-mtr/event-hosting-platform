/**
 * Map Components Interfaces
 * Defines structures for different components extracted from Tiled map files
 */

// Tile layer data from Tiled maps
export interface Layer {
  id: string
  name: string
  data: number[] // Tile data array
  width: number // Layer width in tiles
  height: number // Layer height in tiles
  visible?: boolean
}

// Collision layer data (similar to Layer but semantically different)
export interface Collision {
  id: string
  name: string
  data: number[] // Collision tile data
  width: number
  height: number
  visible?: boolean
}

// Interactive booth objects placed on maps
export interface Booth {
  id: string
  template?: string // Template file reference
  x: number // X position in pixels
  y: number // Y position in pixels
  width: number // Width in pixels
  height: number // Height in pixels
}

// Player spawn point locations
export interface Spawn {
  id: string
  name: string
  x: number // X position in pixels
  y: number // Y position in pixels
}

// Tileset definitions containing tile graphics
export interface Tileset {
  columns: number // Number of tile columns in the image
  firstgid: number // First global tile ID
  image: string // Image file path
  imageheight: number // Image height in pixels
  imagewidth: number // Image width in pixels
  margin: number // Margin around tiles
  name: string // Tileset name
  spacing: number // Spacing between tiles
  tilecount: number // Total number of tiles
  tileheight: number // Individual tile height
  tilewidth: number // Individual tile width
}

// Map dimensions and tile size information
export interface Dimensions {
  width: number // Map width in tiles
  height: number // Map height in tiles
  tilewidth: number // Individual tile width in pixels
  tileheight: number // Individual tile height in pixels
}
