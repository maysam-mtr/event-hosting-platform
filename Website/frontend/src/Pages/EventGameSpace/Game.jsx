import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

const Game = ({ mapInfo, characterInfo }) => {
  const gameRef = useRef(null)
  const gameInstance = useRef(null)

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

  useEffect(() => {
    if (!characterInfo || !mapInfo || !mapInfo.images || !mapInfo.partners || gameInstance.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 840,
      height: 480,
      parent: gameRef.current,
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

    return () => {
      gameInstance.current?.destroy(true)
      gameInstance.current = null
    }
  }, [ characterInfo, mapInfo ])

  return <div ref={gameRef} id="game-container" />
}

export default Game