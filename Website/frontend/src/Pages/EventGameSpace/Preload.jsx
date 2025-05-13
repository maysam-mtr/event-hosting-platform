import { useEffect, useState } from "react"
import Game from "./Game"
import useSendRequest from '../../hooks/use-send-request';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

function Preload() {
  const [images, setImages] = useState([])
  const [partners, setPartners] = useState([])
  const [characterInfo, setCharacterInfo] = useState(null)
  const [sendRequest] = useSendRequest()


  useEffect(() => {
    const fetchMapInfo = async () => {
      try {
        const { response } = await sendRequest("/getMapInformation", {}, "game-engine")

        setImages(response.mapImages.images)
        setPartners(response.partners)
        
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
    fetchMapInfo()
  }, [])

  //return images.length > 0 ? (<Game mapInfo={{ images, partners }} characterInfo={ characterInfo } />) : (<div>Loading...</div>)
  return images.length > 0 ? (<Game mapInfo={{ images, partners }} characterInfo={ characterInfo } />) : (<LoadingSpinner padding={true}/>)
}

export default Preload