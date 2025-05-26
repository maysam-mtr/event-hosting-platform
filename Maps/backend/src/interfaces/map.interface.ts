/**
 * Map Interface
 * Defines the structure for map entities stored in the database
 */

export interface Map {
  id?: string
  original_map_id?: string | null // Links to original map for versioning
  name: string // Human-readable map name
  folderId: string // Google Drive folder containing map files
  imageId: string // Supabase storage path for thumbnail image
  created_at?: string | undefined
  updated_at?: string | undefined
}
