import React, { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { GAME_ENGINE_BASE_URL } from '../lib/api'
import { io } from 'socket.io-client'

const domain = "hi-mr-anaheim-anatomy.trycloudflare.com";
// Connect to backend
const socket = io('http://localhost:3004')
interface MapImage {
  image: string
  name: string
}

interface MapInfo {
  images: MapImage[]
}

interface CharacterInfo {
  width: number
  height: number
  frameCount: number
}

interface GameProps {
  mapInfo: MapInfo
  characterInfo: CharacterInfo | null
}

const Game = ({ mapInfo, characterInfo }: GameProps) => {
  const gameRef = useRef<HTMLDivElement>(null)
  const gameInstance = useRef<Phaser.Game | null>(null)

  // Simulate two test users
  const TEST_USERS = [
    {
      id: 'user1',
      name: 'Alice',
      avatar: '/character.png',
      partnerId: '77a2ee7e-ce44-46d4-b8e4-6cd151a7187b' // Added partnerId property
    },
    {
      id: 'user2',
      name: 'Bob',
      avatar: '/character.png',
      partnerId: '45454545' // Added partnerId property
    }
  ]

  const USER_INDEX = parseInt(new URLSearchParams(window.location.search).get('user') || '0', 10)
  const currentUser = TEST_USERS[USER_INDEX % TEST_USERS.length]
  const [jitsiApi, setJitsiApi] = useState<any>(null);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isCamMuted, setIsCamMuted] = useState(true);
  const [isPartner, setIsPartner] = useState(false);
  const [isChatOpened, setIsChatOpened] = useState(true);
  const [inMeeting, setInMeeting] = useState(false);
  let api: any;
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
    if (gameInstance.current) return
    if(api){
      const handleAudioMute = (data: { muted: boolean | ((prevState: boolean) => boolean) }) => {
        console.log("Mic muted:", data.muted);
        setIsMicMuted(data.muted);
      };
      const handleVideoMute = (data: { muted: boolean | ((prevState: boolean) => boolean) })=> {
        console.log("Camera muted:", data.muted);
        setIsCamMuted(data.muted);
      };

  
      api.addEventListener('audioMuteStatusChanged', handleAudioMute);
      api.addEventListener('videoMuteStatusChanged', handleVideoMute);

  
    }
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 840,
      height: 480,
      parent: gameRef.current!,
      scene: {
        preload() {
          // Load tileset images
          mapInfo.images.forEach(image =>
            this.load.image(image.name, `${GAME_ENGINE_BASE_URL}/assets/${image.image}`)
          )

          // Load map JSON
          this.load.tilemapTiledJSON('map', `${GAME_ENGINE_BASE_URL}/assets/map.json`)

          // Load character spritesheet
          if (characterInfo) {
            this.load.spritesheet('character', currentUser.avatar, {
              frameWidth: characterInfo.width / characterInfo.frameCount,
              frameHeight: characterInfo.height / characterInfo.frameCount,
            })
          }

          // Preload other avatars
      //    this.load.image('avatar1', '/assets/avatar1.png')
        //  this.load.image('avatar2', '/assets/avatar2.png')
        },
        create() {
          // Create map
          const map = this.make.tilemap({ key: 'map' })
          const tileSets = mapInfo.images.map(image =>
            map.addTilesetImage(image.name, image.name)
          )

          let collisionLayer: Phaser.Tilemaps.TilemapLayer | null = null
          map.layers.forEach(layerData => {
            const layer = map.createLayer(layerData.name, tileSets, 0, 0)
            if (layer && layerData.name.toLowerCase().includes('collision')) {
              layer.setCollisionByExclusion([-1, 0])
              layer.setVisible(false)
              collisionLayer = layer
            }
          })

          if (!collisionLayer) {
            console.error("No collision layer found.")
            return
          }

          // Spawn point
          const spawnLayer = map.getObjectLayer('spawn')
          const spawnPoint = spawnLayer.objects[0]

          // Local player setup
          this.player = this.physics.add.sprite(spawnPoint.x!, spawnPoint.y!, 'character').setScale(1)
          this.player.body.setSize(15, 18)
          this.player.body.setOffset(16, 14)

          // Animations
          this.anims.create({ key: 'down', frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }), frameRate: 10, repeat: -1 })
          this.anims.create({ key: 'up', frames: this.anims.generateFrameNumbers('character', { start: 4, end: 7 }), frameRate: 10, repeat: -1 })
          this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('character', { start: 8, end: 11 }), frameRate: 10, repeat: -1 })
          this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('character', { start: 12, end: 15 }), frameRate: 10, repeat: -1 })

          this.player.play('down')

          // Collisions
          this.physics.add.collider(this.player, collisionLayer)

          // Camera setup
          this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
          this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
          this.cameras.main.zoom = 2

          // Input controls
          this.cursors = this.input.keyboard.createCursorKeys()

          // Group for remote players
          this.remotePlayers = this.physics.add.group()

          // Emit initial join event
          socket.emit('joinGame', {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar || '/character.png',
            partnerId: currentUser.partnerId,
            x:spawnPoint.x!,
            y:spawnPoint.y!
          })

          // Send position updates
          this.time.addEvent({
            delay: 30,
            loop: true,
            callback: () => {
              socket.emit("playerMove", {
                name: currentUser.name,
                avatar: currentUser.avatar,
                id: currentUser.id,
                x: this.player.x,
                y: this.player.y
              })
            }
          })

          // Handle incoming moves
          socket.on("playerMoved", (data) => {
            if (data.userId === currentUser.id) return

            let remotePlayer = this.remotePlayers.getChildren().find(
              (p: any) => p.getData("userId") === data.userId
            )

            if (!remotePlayer) {
              remotePlayer = this.physics.add.sprite(data.x, data.y, 'character')
                .setData("userId", data.userId)

              // Add name label
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

              this.add.existing(nameLabel)
              remotePlayer.setData("label", nameLabel)
              this.remotePlayers.add(remotePlayer)
            }

            // Update sprite & label
            remotePlayer.setPosition(data.x, data.y)
            remotePlayer.getData("label").setPosition(data.x, data.y - 20)
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
 // console.log(`You [${currentUser.id}] entered booth ${boothId}`)
 // const jitsiFrame = document.getElementById("jitsi-frame") as HTMLIFrameElement
 // jitsiFrame.src = meetingUrl
 // console.log(meetingUrl)
  //jitsiFrame.style.display = "block"
})

function joinJitsiMeeting(boothId: string) {
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
      displayName: currentUser.name,
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
  console.log(`You [${currentUser.id}] exited booth ${boothId}`)
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
              (p: any) => p.getData("userId") === userId
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

          // Normalize diagonal movement
          const magnitude = Math.sqrt(velocityX ** 2 + velocityY ** 2)
          if (magnitude > speed) {
            velocityX /= magnitude / speed
            velocityY /= magnitude / speed
          }

          // Apply velocity
          this.player.setVelocity(velocityX, velocityY)

          // Play animation
          if (velocityX < 0) this.player.anims.play("left", true)
          else if (velocityX > 0) this.player.anims.play("right", true)
          else if (velocityY < 0) this.player.anims.play("up", true)
          else if (velocityY > 0) this.player.anims.play("down", true)
          else this.player.anims.stop()
        }
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      }
    }

    gameInstance.current = new Phaser.Game(config)

    return () => {
      socket.off("playerMoved")
      socket.off("playerDisconnected")
      gameInstance.current?.destroy(true)
      gameInstance.current = null
    }
  }, [])

 return (
  <>
    <div ref={gameRef} id="game-container" style={{ width: "1040px", height: "680px", alignContent:"center"}}>
    {
  inMeeting && (
    <div>
  <button onClick={toggleMic}>🎤 {isMicMuted ? "Enable Mic" : "Disable Mic"}</button>
  <button onClick={toggleCamera}>📹 {isCamMuted ? "Enable Camera" : "Disable Camera"}</button>
  <button onClick={openChat}>💬 {isChatOpened ? "Open Chat" : "Close Chat"}</button>
  

{isPartner && (
  <button onClick={toggleScreenShare}>
    🖥️ {isSharingScreen ? "Stop Sharing" : "Start Screen Share"}
  </button>
)}</div>)}
</div> 
    <div id="jitsi-meet" style={{
  width: '400px',
  height: '300px',
  position: 'absolute',
  top: '50px',
  right: '50px',
  zIndex: 100,
}}>
</div>
  </>
)
}

export default Game