export const GAME_ENGINE_BASE_URL = "gameback.eventurelb.online"

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