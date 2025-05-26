/**
 * Latest Map Interface
 * Defines the structure for tracking the latest version of each original map
 */

export interface LatestMap {
  id?: string
  original_map_id: string // ID of the original map
  latest_map_id: string // ID of the current latest version
  created_at?: string | undefined
  updated_at?: string | undefined
}
