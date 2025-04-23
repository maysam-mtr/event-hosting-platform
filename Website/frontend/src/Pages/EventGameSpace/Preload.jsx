import { useEffect, useState, useRef } from "react"
import Game from "./Game"
import useSendRequest from '../../hooks/use-send-request';

function Preload({ eventId }) {
  const [images, setImages] = useState([])
  const [partners, setPartners] = useState([])
  const [characterInfo, setCharacterInfo] = useState(null)
  const gameEngineUrl = useRef(null)  // Store the URL once, no re-render needed
  const [sendRequest] = useSendRequest()

  useEffect(() => {
    const fetchMapInfo = async () => {
      try {
        const { response: schedulerResponse } = await sendRequest(`/getGameEnginePort/${eventId}`, {}, 'scheduler')
        
        var gameEnginePort = 0
        if (schedulerResponse.statusCode === 200) {
          gameEnginePort = schedulerResponse?.data?.hostPort
          gameEngineUrl.current = `http://localhost:${gameEnginePort}`;
        } else {
          console.warn("Error fetching game-engine port");
          return;
        }
        
        const { response: gameEngineResponse } = await sendRequest(`${gameEnginePort}/getMapInformation`, {}, 'game-engine')
        
        if (gameEngineResponse) {
          setImages(gameEngineResponse.mapImages)
          setPartners(gameEngineResponse.partners)
        } else {
          console.warn("gameEngineResponse returned is null for: /getMapInformation call");
          return
        }
        
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
  }, [eventId])  // Ensure this effect is triggered when the eventId changes

  return images.length > 0 ? (
    <Game mapInfo={{ images, partners }} characterInfo={characterInfo} gameEngineUrl={gameEngineUrl.current} />
  ) : (
  <div>Loading...</div>
  )
}

export default Preload
