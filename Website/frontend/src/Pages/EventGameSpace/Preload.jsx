import { useEffect, useState } from "react"
import Game from "./Game"
import useSendRequest from '../../hooks/use-send-request';

function Preload() {
  const [images, setImages] = useState([])
  const [characterInfo, setCharacterInfo] = useState(null)
  const [sendRequest] = useSendRequest()


  useEffect(() => {
    const fetchLayerNames = async () => {
      try {
        const { response } = await sendRequest("/getTilesetImages", {}, "game-engine")
        setImages(response.data.images)
        
      } catch (err) {
        console.error("Failed to fetch layer names:", err)
      }
    }

    const img = new Image()
    img.src = "/character.png"
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