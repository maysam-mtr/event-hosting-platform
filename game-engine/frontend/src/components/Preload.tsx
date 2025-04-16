import { useEffect, useState } from "react"
import { getMapInfo } from "../lib/api"
import Game from "./Game"

function Preload() {
  const [images, setImages] = useState<{ image: string, name: string }[]>([])
  const [characterInfo, setCharacterInfo] = useState<{ width: number, height: number, frameCount: number } | null>(null)

  useEffect(() => {
    const fetchLayerNames = async () => {
      try {
        const res = await getMapInfo()
        setImages(res.images)
      } catch (err) {
        console.error("Failed to fetch layer names:", err)
      }
    }

    const img = new Image()
    img.src = "character.png"
    img.onload = () => {
      setCharacterInfo({
        width: img.width,
        height: img.height,
        frameCount: 4
      })
    }

    fetchLayerNames()
  }, [])

  return images.length > 0 ? (<Game mapInfo={{ images }} characterInfo={ characterInfo } />) : (<div>Loading...</div>)
}

export default Preload