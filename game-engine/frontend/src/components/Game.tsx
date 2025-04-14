import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { GAME_ENGINE_BASE_URL } from '../lib/api'

interface mapInfo {
  images: { image: string, name: string }[]
}

interface characterInfo {
  width: number
  height: number
  frameCount: number
}

interface GameProps {
  mapInfo: mapInfo
  characterInfo: characterInfo | null
}

const Game = ({ mapInfo, characterInfo } : GameProps) => {
  const gameRef = useRef<HTMLDivElement>(null)
  const gameInstance = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (gameInstance.current) return

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 840,
      height: 480,
      parent: gameRef.current!,
      scene: {
        preload() {
          mapInfo.images.forEach(image => {
            this.load.image(image.name, `${GAME_ENGINE_BASE_URL}/assets/${image.image}`)
          })
          this.load.tilemapTiledJSON('map', `${GAME_ENGINE_BASE_URL}/assets/map.json`)
          this.load.spritesheet('character', 'character.png', {
            frameWidth: characterInfo!.width / characterInfo!.frameCount,
            frameHeight: characterInfo!.height / characterInfo!.frameCount
          })
        },
        create() {
          const map = this.make.tilemap({ key: 'map' })
          const tileSets = mapInfo.images.map(image => 
            map.addTilesetImage(image.name, image.name)
          )
          var collisionLayer: Phaser.Tilemaps.TilemapLayer | null = null
          map.layers.forEach(layerData => {
            const layer = map.createLayer(layerData.name, tileSets, 0,0)
            
            if (layerData.name.toLowerCase().includes("collision")) {
              layer.setCollisionByExclusion([-1, 0]) // Exclude empty tiles and non-collidable tiles
              layer.setVisible(false)
              collisionLayer = layer
            }
          })
          
          if (!collisionLayer) {
            console.error("No collision layer found in the map.")
            return
          }

          // Spawn point setup
          const spawnLayer = map.getObjectLayer('spawn')
          const spawnPoint = spawnLayer.objects[0]

          // Player setup
          this.player = this.physics.add.sprite(
            spawnPoint.x!,
            spawnPoint.y!,
            'character'
          ).setScale(1)

          this.player.body.setSize(15, 18) // Visible part of the sprite
          this.player.body.setOffset(16, 14) // Centering the physics body with the sprite

          // Character animations
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
          this.player.play('down') // Default animation

          // Collisions
          this.physics.add.collider(this.player, collisionLayer)

          // Camera setup
          this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
          this.cameras.main.startFollow(this.player, true, 0.1, 0.1) // Smooth follow

          // Zoom in
          this.cameras.main.zoom = 2

          // Input controls
          this.cursors = this.input.keyboard.createCursorKeys()
        },
        update() {
          const speed = 100
          let velocityX = 0
          let velocityY = 0

          // Movement logic
          if (this.cursors.left.isDown) velocityX = -speed
          else if (this.cursors.right.isDown) velocityX = speed
          if (this.cursors.up.isDown) velocityY = -speed
          else if (this.cursors.down.isDown) velocityY = speed


          // Normalize diagonal speed
          const magnitude = Math.sqrt(velocityX ** 2 + velocityY ** 2)
          if (magnitude > speed) {
            velocityX /= magnitude / speed
            velocityY /= magnitude / speed
          }


          // Update velocity and animation
          this.player.setVelocity(velocityX, velocityY)
          if (velocityX < 0) this.player.anims.play('left', true)
          else if (velocityX > 0) this.player.anims.play('right', true)
          else if (velocityY < 0) this.player.anims.play('up', true)
          else if (velocityY > 0) this.player.anims.play('down', true)
          else this.player.anims.stop() // Stop animation when idle
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

    return () => {
      gameInstance.current?.destroy(true)
      gameInstance.current = null
    }
  }, [])

  return <div ref={gameRef} id="game-container" />
}

export default Game