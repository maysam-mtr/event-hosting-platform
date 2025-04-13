import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const GAME_ENGINE_ASSETS_BASE_URL = "http://localhost:3004/assets"

const Game = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstance = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameInstance.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 840, // Initial canvas size
      height: 480,
      parent: gameRef.current!,
      scene: {
        preload() {
          this.load.image('tileset', `${GAME_ENGINE_ASSETS_BASE_URL}/tileset.png`);
          this.load.image('collision', `${GAME_ENGINE_ASSETS_BASE_URL}/collision.png`);
          this.load.tilemapTiledJSON('map', `${GAME_ENGINE_ASSETS_BASE_URL}/map.json`);
          this.load.spritesheet('character', 'character.png', {
            frameWidth: 48, // Correct frame width
            frameHeight: 48 // Correct frame height
          });
        },
        create() {
          const map = this.make.tilemap({ key: 'map' });
          const mainTileset = map.addTilesetImage('tileset', 'tileset');
          const collisionTileset = map.addTilesetImage('collision', 'collision');

          // Create all layers explicitly
          map.createLayer('Layers/ground', mainTileset);
          map.createLayer('Layers/grass', mainTileset);
          map.createLayer('Layers/fence', mainTileset);
          map.createLayer('Layers/water', mainTileset);
          map.createLayer('Layers/aroundWater', mainTileset);
          map.createLayer('Layers/houses', mainTileset);
          map.createLayer('Layers/booths ground', mainTileset);

          // Collision layer setup
          const collisionLayer = map.createLayer('Collisions/collisions', collisionTileset);
          
          collisionLayer.setCollisionByExclusion([-1, 0]); // Exclude empty tiles and non-collidable tiles

          // Spawn point setup
          const spawnLayer = map.getObjectLayer('spawn');
          const spawnPoint = spawnLayer.objects[0];

          // Player setup
          this.player = this.physics.add.sprite(
            spawnPoint.x!,
            spawnPoint.y!,
            'character'
          ).setScale(1);

          this.player.body.setSize(15, 18); // Visible part of the sprite
          this.player.body.setOffset(16, 14); // Centering the physics body with the sprite

          // Character animations
          this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('character', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
          });
          this.player.play('down'); // Default animation

          // Collisions
          this.physics.add.collider(this.player, collisionLayer);

          // Camera setup
          this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
          this.cameras.main.startFollow(this.player, true, 0.1, 0.1); // Smooth follow

          // Zoom in
          this.cameras.main.zoom = 2;

          // Input controls
          this.cursors = this.input.keyboard.createCursorKeys();
        },
        update() {
          const speed = 100;
          let velocityX = 0;
          let velocityY = 0;

          // Movement logic
          if (this.cursors.left.isDown) velocityX = -speed;
          else if (this.cursors.right.isDown) velocityX = speed;
          if (this.cursors.up.isDown) velocityY = -speed;
          else if (this.cursors.down.isDown) velocityY = speed;


          // Normalize diagonal speed
          const magnitude = Math.sqrt(velocityX ** 2 + velocityY ** 2);
          if (magnitude > speed) {
            velocityX /= magnitude / speed;
            velocityY /= magnitude / speed;
          }


          // Update velocity and animation
          this.player.setVelocity(velocityX, velocityY);
          if (velocityX < 0) this.player.anims.play('left', true);
          else if (velocityX > 0) this.player.anims.play('right', true);
          else if (velocityY < 0) this.player.anims.play('up', true);
          else if (velocityY > 0) this.player.anims.play('down', true);
          else this.player.anims.stop(); // Stop animation when idle
        }
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }, // Disable gravity for top-down movement
          debug: true // Visualize collision boxes
        }
      }
    };

    gameInstance.current = new Phaser.Game(config);

    return () => {
      gameInstance.current?.destroy(true);
      gameInstance.current = null;
    };
  }, []);

  return <div ref={gameRef} id="game-container" />;
};

export default Game;