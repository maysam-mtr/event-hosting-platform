/**
 * Application Constants
 * Defines file types and layer class names used throughout the map processing system
 */

// Enum defining supported file types for map creation
export enum FileTypes {
  MapFile = "mapFile", // Tiled map files (.tmx)
  JsonFile = "jsonFile", // JSON map data files
  TilesetFiles = "tilesetFiles", // Tileset definition files (.tsx)
  TemplateFiles = "templateFiles", // Template object files (.tx)
  ImageFiles = "imageFiles", // Image assets (.png, .jpg, etc.)
}

// Array of all file types for validation
export const fileTypes = Object.values(FileTypes)

// Special file type for map thumbnails
export const thumbnailFileType = "thumbnailFile"

// Map layer class names used in Tiled map editor
export const boothesClassName = "Booths" // Layer containing booth objects
export const collisionsClassName = "Collisions" // Layer containing collision data
export const spawnLocationClassName = "spawn" // Layer containing spawn points
export const layersClassName = "layers" // Regular tile layers
