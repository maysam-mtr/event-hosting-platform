/**
 * Preload Component
 *
 * Handles loading and initialization of game assets:
 * - Fetches map information and game engine configuration
 * - Loads character sprites and animation data
 * - Retrieves partner booth information and logos
 * - Manages game engine port communication
 * - Provides loading states during asset preparation
 *
 * Ensures all necessary resources are loaded before
 * initializing the virtual event environment.
 */

import { useEffect, useRef, useState } from "react"
import Game from "./Game"
import useSendRequest from '../../hooks/use-send-request';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

function Preload({ eventId }) {
  const [images, setImages] = useState([])
  const [partners, setPartners] = useState([])
  const [characterInfo, setCharacterInfo] = useState(null)
  const gameEngineUrl = useRef(null)
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
          setImages(gameEngineResponse.mapImages.images)
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
  }, [eventId])


  return images.length > 0 ? (<Game mapInfo={{ images, partners }} characterInfo={ characterInfo } gameEngineUrl={gameEngineUrl.current} />) : (<LoadingSpinner padding={true}/>)
}

export default Preload