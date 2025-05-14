import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { io } from 'socket.io-client'
import useUserState from '../../hooks/use-user-state';
import styled from 'styled-components';
import GameControls from './GameControls';

const MapContainer = styled.div`
width: 100%;
height: 100%;
align-content: center;
`;

const JitsiContainer = styled.div`
width: 400px;
height: 300px;
position: absolute;
top: 50px;
right: 50px;
z-index: 100;
`;

const domain = "descriptions-sas-kathy-sunday.trycloudflare.com";
// Connect to backend
const socket = io('http://localhost:3004')

const Game = ({ mapInfo, characterInfo }) => {
  const gameRef = useRef(null)
  const gameInstance = useRef(null)
  const { user, setUser } = useUserState();
  
  function zoomIn() {
    const scene = gameInstance.current?.scene?.scenes?.[0];
    if (scene && scene.cameras && scene.cameras.main) {
      const newZoom = Math.min(scene.cameras.main.zoom * 1.2, 4); // 4 is max zoom
      scene.cameras.main.setZoom(newZoom);
    }
  }

  function zoomOut() {
    const scene = gameInstance.current?.scene?.scenes?.[0];
    if (scene && scene.cameras && scene.cameras.main) {
      const minZoom = scene.minZoom || 0.1; // fallback if not set
      const newZoom = Math.max(scene.cameras.main.zoom / 1.2, minZoom);
      scene.cameras.main.setZoom(newZoom);
    }
  }



  console.log("user:", user);

  const GAME_ENGINE_BASE_URL = import.meta.env.VITE_GAME_ENGINE_API_URL

  // recurse nested layers
  function findObjectById(layers, targetId) {
    for (const layer of layers) {
      if (layer.type === 'objectgroup') {
        const found = layer.objects.find(o => o.id === targetId)
        if (found) return found
      }
      if (layer.type === 'group') {
        const found = findObjectById(layer.layers, targetId)
        if (found) return found
      }
    }
    return null
  }

  const [jitsiApi, setJitsiApi] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isCamMuted, setIsCamMuted] = useState(true);
  const [isPartner, setIsPartner] = useState(false);
  const [isChatOpened, setIsChatOpened] = useState(false);
  const [inMeeting, setInMeeting] = useState(false);
  let api;
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  function toggleScreenShare() {
    if (!jitsiApi) return;
  
    jitsiApi.executeCommand('toggleShareScreen');
    setIsSharingScreen(prev => !prev);
  }
  function toggleMic() {
    jitsiApi.executeCommand('toggleAudio');
    setIsMicMuted(!isMicMuted);
  }
  function openChat() {
  setIsChatOpened(!isChatOpened);
    jitsiApi.executeCommand('toggleChat');
  }

  function toggleCamera() {
    jitsiApi.executeCommand('toggleVideo');
    setIsCamMuted(!isCamMuted);
  }

  useEffect(() => {
    if (!characterInfo || !mapInfo || !mapInfo.images || !mapInfo.partners || gameInstance.current) return;

    

    if(api){
      const handleAudioMute = (data) => {
        console.log("Mic muted:", data.muted);
        setIsMicMuted(data.muted);
      };
      const handleVideoMute = (data)=> {
        console.log("Camera muted:", data.muted);
        setIsCamMuted(data.muted);
      };

  
      api.addEventListener('audioMuteStatusChanged', handleAudioMute);
      api.addEventListener('videoMuteStatusChanged', handleVideoMute);

      

  
    }


    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth, //or statiz 1600
      height: window.innerHeight, //or static 700
      parent: gameRef.current,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: {
        preload() {
          this.load.json('mapdata', `${GAME_ENGINE_BASE_URL}/assets/map.json`)

          mapInfo.images.forEach(image => {
            this.load.image(image.name, `${GAME_ENGINE_BASE_URL}/assets/${image.image}`)
          })
          this.load.tilemapTiledJSON('map', `${GAME_ENGINE_BASE_URL}/assets/map.json`)
          this.load.spritesheet('character', '/character.png', {
            frameWidth: characterInfo.width / characterInfo.frameCount,
            frameHeight: characterInfo.height / characterInfo.frameCount
          })
          
          mapInfo.partners.forEach(partner => {
            this.load.image(
              partner.boothId,
              `${GAME_ENGINE_BASE_URL}/assets/partners/${partner.companyLogo}`
            )
          })
        },
        create() {
          const map = this.make.tilemap({ key: 'map' })
          const tileSets = mapInfo.images.map(image => 
            map.addTilesetImage(image.name, image.name)
          )
          let collisionLayer = null
          map.layers.forEach(layerData => {
            const layer = map.createLayer(layerData.name, tileSets, 0, 0)
            if (layerData.name.toLowerCase().includes("collision")) {
              layer.setCollisionByExclusion([-1, 0])
              layer.setVisible(false)
              collisionLayer = layer
            }
          })

          if (!collisionLayer) {
            console.error("No collision layer found in the map.")
            return
          }

          const spawnLayer = map.getObjectLayer('spawn')
          const spawnPoint = spawnLayer.objects[0]

          this.player = this.physics.add.sprite(
            spawnPoint.x,
            spawnPoint.y,
            'character'
          ).setScale(1)

          this.player.body.setSize(15, 18)
          this.player.body.setOffset(16, 14)

          this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
          })
          this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
          })
          this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('character', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
          })
          this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
          })

          this.player.play('down')

          this.physics.add.collider(this.player, collisionLayer)

          this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
          this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
          this.cameras.main.zoom = 2

          //zoom thing
          const cam = this.cameras.main;
          const minZoom = Math.max(
            cam.width / map.widthInPixels,
            cam.height / map.heightInPixels
          );
          this.minZoom = minZoom;
          //jc

          this.cursors = this.input.keyboard.createCursorKeys()
          
          // Display company logos
          const raw = this.cache.json.get('mapdata')
          
          if (!raw) {
            console.error('Raw mapdata missing!')
          } else {
            mapInfo.partners.forEach(partner => {
              const idNum = Number(partner.boothId)
              const booth = findObjectById(raw.layers, idNum)
              if (!booth) {
                console.warn(`Booth ${partner.boothId} not found`)
                return
              }
          
              // Center of booth
              const cx = booth.x + booth.width / 2
              const cy = booth.y + booth.height / 2
          
              const logo = this.add.image(cx, cy, partner.boothId)
          
              // Stretch image to booth dimensions
              logo.setDisplaySize(booth.width, booth.height)
            })
          
            // Place player above booth images
            this.player.setDepth(1)
          }
          
          
          // Group for remote players
          this.remotePlayers = this.physics.add.group()

          // Emit initial join event
          socket.emit('joinGame', {
            id: user.id,
            name: user.fullName,
            avatar: '/character.png',
            partnerId: user.partnerId,
            x:spawnPoint.x,
            y:spawnPoint.y
          })

          // Send position updates
          this.time.addEvent({
            delay: 30,
            loop: true,
            callback: () => {
              socket.emit("playerMove", {
                name: user.fullName,
                avatar: user.avatar,
                id: user.id,
                x: this.player.x,
                y: this.player.y
              })
            }
          })

          // Handle incoming moves
          socket.on("playerMoved", (data) => {
            if (data.userId === user.id) return

            let remotePlayer = this.remotePlayers.getChildren().find(
              (p) => p.getData("userId") === data.userId
            )

            if (!remotePlayer) {
              remotePlayer = this.physics.add.sprite(data.x, data.y, 'character')
                .setData("userId", data.userId)
                .setData("prevX", data.x)
                .setData("prevY", data.y)

              const nameLabel = this.add.text(
                data.x,
                data.y - 20,
                data.name,
                {
                  fontSize: "12px",
                  color: "#fff",
                  backgroundColor: "#0008",
                  padding: { left: 4, right: 4, top: 2, bottom: 2 }
                }
              ).setOrigin(0.5)

              remotePlayer.setData("label", nameLabel)
              this.remotePlayers.add(remotePlayer)
            }

            const prevX = remotePlayer.getData("prevX")
            const prevY = remotePlayer.getData("prevY")

            remotePlayer.setPosition(data.x, data.y)
            remotePlayer.getData("label").setPosition(data.x, data.y - 20)

            const dx = data.x - prevX
            const dy = data.y - prevY

            const moveThreshold = 0.1

            let direction = 'down'

            if (Math.abs(dx) > moveThreshold) {
              direction = dx > 0 ? 'right' : 'left'
            } else if (Math.abs(dy) > moveThreshold) {
              direction = dy > 0 ? 'down' : 'up'
            }

            if (Math.abs(dx) > moveThreshold || Math.abs(dy) > moveThreshold) {
              if (!remotePlayer.anims.isPlaying || remotePlayer.anims.currentAnim?.key !== direction) {
                remotePlayer.play(direction, true)
              }
            } else {
              remotePlayer.anims.stop()
            }

            remotePlayer.setData("prevX", data.x)
            remotePlayer.setData("prevY", data.y)
          })
          socket.on("userKicked", () => {
            console.warn("You were kicked — reloading...")
            alert("You logged in elsewhere. Reload to rejoin.")
            window.location.reload()
            socket.off("userKicked")
          })

          // Add booth tracking variable
          this.currentlyInBooth = null
          // When YOU enter a booth
          socket.on("enteredBooth", (data) => {
            const { boothId,meetingUrl } = data
            joinJitsiMeeting(boothId)
            const isPartner = data.isPartner;
            setIsPartner(isPartner);
            console.log("isPartner",isPartner)
          // console.log(`You [${user.id}] entered booth ${boothId}`)
          // const jitsiFrame = document.getElementById("jitsi-frame") as HTMLIFrameElement
          // jitsiFrame.src = meetingUrl
          // console.log(meetingUrl)
            //jitsiFrame.style.display = "block"
          })

          function joinJitsiMeeting(boothId) {
            const jitsiContainer = document.getElementById("jitsi-meet");
            if (!jitsiContainer) return;

            jitsiContainer.innerHTML = ""; // Clear previous iframe

          const toolbarButtons = [
            'fullscreen'
          ];

            const roomName = `booth_${boothId}`;
            const options = {
              roomName,
              width: 400,
              height: 300,
              parentNode: document.getElementById("jitsi-meet"),
              userInfo:{
                displayName: user.fullName,
                role: 'guest'
              },
              configOverwrite: {
                prejoinPageEnabled: false,
                enableWelcomePage: false,
                startWithAudioMuted: true,
                startWithVideoMuted: true,
                disableDeepLinking: true,
              requireDisplayName: false,
              autoPlayVideo: false
              },
              interfaceConfigOverwrite: {
                filmStripOnly: false,
                HIDE_MODERATION_BADGE: true,
                enableNoisyPopups: false,
                SHOW_JITSI_WATERMARK: false,
                TOOLBAR_BUTTONS: toolbarButtons, // hide all buttons
                DISPLAY_DRAWER_DISABLED: true,
                HIDE_INVITE_MORE_HEADER: true,
                MODERATOR_INDICATOR_DISABLED:true,
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
              }
            };

            // @ts-ignore - JitsiMeetExternalAPI is added via script
            api = new window.JitsiMeetExternalAPI(domain, options);
            setJitsiApi(api);
            setInMeeting(true)
          }
          socket.on("exitedBooth", (data) => {
            const { boothId } = data
            console.log(`You [${user.id}] exited booth ${boothId}`)
            if (jitsiApi) {
              jitsiApi.executeCommand("hangup"); // Ends call gracefully
            }

            const jitsiContainer = document.getElementById("jitsi-meet");
            if (jitsiContainer) {
              jitsiContainer.innerHTML = ""; // Clear iframe content
            }

            // Optional: Reset local state
            setJitsiApi(null);
            setInMeeting(false)
          })

          // Handle disconnect
          socket.on("playerDisconnected", (userId) => {
            const player = this.remotePlayers.getChildren().find(
              (p) => p.getData("userId") === userId
            )
            if (player) {
              const label = player.getData("label")
              label.destroy()
              player.destroy()
            }
          })
        },
        update() {
          const speed = 100
          let velocityX = 0
          let velocityY = 0

          if (this.cursors.left.isDown) velocityX = -speed
          else if (this.cursors.right.isDown) velocityX = speed
          if (this.cursors.up.isDown) velocityY = -speed
          else if (this.cursors.down.isDown) velocityY = speed

          const magnitude = Math.sqrt(velocityX ** 2 + velocityY ** 2)
          if (magnitude > speed) {
            velocityX /= magnitude / speed
            velocityY /= magnitude / speed
          }

          this.player.setVelocity(velocityX, velocityY)
          if (velocityX < 0) this.player.anims.play('left', true)
          else if (velocityX > 0) this.player.anims.play('right', true)
          else if (velocityY < 0) this.player.anims.play('up', true)
          else if (velocityY > 0) this.player.anims.play('down', true)
          else this.player.anims.stop()
        }
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: true
        }
      }
    }

    gameInstance.current = new Phaser.Game(config)

    //for responsiveness
    const handleResize = () => {
      const canvas = gameRef.current?.querySelector('canvas');
      if (canvas) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
      }
      if (gameInstance.current) {
        gameInstance.current.scale.resize(window.innerWidth, window.innerHeight);
      }
    };

     window.addEventListener('resize', handleResize);

    return () => {
      socket.off("playerMoved")
      socket.off("playerDisconnected")
      gameInstance.current?.destroy(true)
      gameInstance.current = null

      //for responsiveness
      window.removeEventListener('resize', handleResize);
      if (gameInstance.current) {
        gameInstance.current.destroy(true);
      }
    }
  }, [])

  return (
  <>
    <MapContainer ref={gameRef} id="game-container">
        <GameControls 
            onZoomIn={zoomIn} 
            onZoomOut={zoomOut} 
            toggleMic={toggleMic} 
            toggleCamera={toggleCamera} 
            isCamMuted={isCamMuted} 
            openChat={openChat}
            isChatOpened={isChatOpened}
            isPartner={isPartner}
            isSharingScreen={isSharingScreen}
            toggleScreenShare={toggleScreenShare}
            isMicMuted={isMicMuted}
            inMeeting={inMeeting}/>
    </MapContainer> 
    <JitsiContainer id="jitsi-meet">
    </JitsiContainer>
  </>
  )
}

export default Game