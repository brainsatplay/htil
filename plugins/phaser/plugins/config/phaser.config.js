
const root = 'content/phaser/'


var map;
var player;
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;
var jumpAction = false;
var wrapping = true;

function preload() {
  // map made with Tiled in JSON format
  this.load.tilemapTiledJSON("map", root + "assets/map.json");
  // tiles in spritesheet
  this.load.spritesheet("tiles", root + "assets/tiles.png", {
    frameWidth: 70,
    frameHeight: 70,
  });
  // simple coin image
  this.load.image("coin", root + "assets/coinGold.png");
  // player animations
  this.load.atlas("player", root + "assets/player.png", root + "assets/player.json");
}

function create() {
  // load the map
  map = this.make.tilemap({ key: "map" });

  // tiles for the ground layer
  var groundTiles = map.addTilesetImage("tiles");
  // create the ground layer
  groundLayer = map.createDynamicLayer("World", groundTiles, 0, 0);
  // the player will collide with this layer
  groundLayer.setCollisionByExclusion([-1]);

  // coin image used as tileset
  var coinTiles = map.addTilesetImage("coin");
  // add coins as tiles
  coinLayer = map.createDynamicLayer("Coins", coinTiles, 0, 0);

  // set the boundaries of our game world
  this.physics.world.bounds.width = groundLayer.width;
  this.physics.world.bounds.height = groundLayer.height;

  // create the player sprite
  player = this.physics.add.sprite(200, 200, "player");
  player.setBounce(0.2); // our player will bounce from items
  player.setCollideWorldBounds(false); // don't go out of the map

  // small fix to our player images, we resize the physics body object slightly
  player.body.setSize(player.width, player.height - 8);

  // player will collide with the level tiles
  this.physics.add.collider(groundLayer, player);

  coinLayer.setTileIndexCallback(17, collectCoin, this);
  // when the player overlaps with a tile with index 17, collectCoin
  // will be called
  this.physics.add.overlap(player, coinLayer);

  window.player = player;

  // player walk animation
  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNames("player", {
      prefix: "p1_walk",
      start: 1,
      end: 11,
      zeroPad: 2,
    }),
    frameRate: 10,
    repeat: -1,
  });
  // idle with only one frame, so repeat is not neaded
  this.anims.create({
    key: "idle",
    frames: [{ key: "player", frame: "p1_stand" }],
    frameRate: 10,
  });

  cursors = this.input.keyboard.createCursorKeys();

  // set bounds so the camera won't go outside the game world
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  // make the camera follow the player
  this.cameras.main.startFollow(player);

  // set background color, so the sky is not black
  this.cameras.main.setBackgroundColor("#ccccff");

  // this text will show the score
  text = this.add.text(20, 570, "0", {
    fontSize: "20px",
    fill: "#ffffff",
  });
  // fix the text to the camera
  text.setScrollFactor(0);
}

// this function will be called when the player touches a coin
function collectCoin(sprite, tile) {
  coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
  score++; // add 10 points to the score
  text.setText(score); // set the text to show the current score
  return false;
}

function update(time, delta) {
//   // Player runs automatically.
//   //player.body.setVelocityX(200);
//   player.anims.play("walk", true);
//   player.flipX = false; // use the original sprite looking to the right

//   // Check if the player got to the end of the scene, take it back to the origin.
//   if (player.x >= 2060) {
//     player.x = 0.5;
//   }

//   if (player.body.velocity.x === 0) {
//     player.anims.play("walk", false);
//   } else {
//     player.anims.play("walk", true);
//   }

  if (cursors.left.isDown) {
      player.body.setVelocityX(-200);
      player.anims.play('walk', true); // walk left
      player.flipX = true; // flip the sprite to the left
  } else if (cursors.right.isDown) {
    console.log(player.x)

      player.body.setVelocityX(200);
      player.anims.play('walk', true);
      player.flipX = false; // use the original sprite looking to the right
  } else {
      player.body.setVelocityX(0);
      player.anims.play('idle', true);
  }

  // EMG Threshold check to make the player JUMP.
  /*
  console.log(player.body.velocity);
  if (emgData > threshold) {
    player.body.setVelocityY(-500);
  }*/
}

// Uses window.Phaser
const defaultConfig = (parent) => {
 const config = {
    parent,
    type: window.Phaser.AUTO,
    width: "100",
    height: "100",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
}
return config
}

export default defaultConfig;