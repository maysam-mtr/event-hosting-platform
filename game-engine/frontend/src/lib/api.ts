export const GAME_ENGINE_BASE_URL = "http://localhost:3004"

export const getMapInfo = async () => {
    try {
      const res = await fetch(`${GAME_ENGINE_BASE_URL}/getTilesetImages`)
      
      if (!res.ok) {
        throw new Error(`Failed to fetch layer names: ${res.statusText}`)
      }
      const data = await res.json()
      return data.data
    } catch (err: any) {
      throw new Error("Error fetching layer names")
    }
  }