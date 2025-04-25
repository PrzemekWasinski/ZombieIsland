const socket = new WebSocket('wss://ws.zombieisland.online/');

socket.onopen = () => {
  console.log("Connected to server");
};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const tileSources = {
  0: "../assets/map/mountain-rock-1.png",
  1: "../assets/map/mountain-rock-2.png",
  2: "../assets/map/mountain-rock-3.png",
  3: "../assets/map/mountain-tree-1.png",
  4: "../assets/map/mountain-tree-2.png",
  5: "../assets/map/mountain-tree-3.png",
  6: "../assets/map/mountain-grass-1.png",
  7: "../assets/map/mountain-grass-2.png",
  8: "../assets/map/mountain-grass-3.png",
  9: "../assets/map/mountain-grass-4.png",
  10: "../assets/map/mountain-bush-1.png",
  11: "../assets/map/mountain-bush-2.png",
  12: "../assets/map/mountain-bush-3.png",
  13: "../assets/map/ocean-ice-1.png",
  14: "../assets/map/ocean-water-1.png",
  15: "../assets/map/mountain-flower-1.png",
  16: "../assets/map/forest-rock-1.png",
  17: "../assets/map/forest-rock-2.png",
  18: "../assets/map/forest-rock-3.png",
  19: "../assets/map/forest-tree-1.png",
  20: "../assets/map/forest-tree-2.png",
  21: "../assets/map/forest-tree-3.png",
  22: "../assets/map/forest-grass-1.png",
  23: "../assets/map/forest-grass-2.png",
  24: "../assets/map/forest-grass-3.png",
  25: "../assets/map/forest-grass-4.png",
  26: "../assets/map/forest-bush-1.png",
  27: "../assets/map/forest-mushroom-1.png",
  28: "../assets/map/forest-mushroom-2.png",
  29: "../assets/map/forest-sand-1.png",
  30: "../assets/map/ocean-water-2.png",
  31: "../assets/map/forest-flower-1.png",
  32: "../assets/map/desert-rock-1.png",
  33: "../assets/map/desert-rock-2.png",
  34: "../assets/map/desert-rock-3.png",
  35: "../assets/map/desert-tree-1.png",
  36: "../assets/map/desert-tree-2.png",
  37: "../assets/map/desert-tree-3.png",
  38: "../assets/map/desert-sand-1.png",
  39: "../assets/map/desert-flower-1.png",
  40: "../assets/map/desert-cactus-1.png",
  41: "../assets/map/desert-cactus-2.png",
  42: "../assets/map/desert-cactus-3.png",
};

const tileImages = {};
let imagesLoaded = 0;
let totalImages = Object.keys(tileSources).length;

const TILE_SIZE = 61;
const MOVE_SPEED = 5; 

function loadImages(callback) {
  for (let key in tileSources) {
    const img = new Image();
    img.src = tileSources[key];

    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        callback(); 
      }
    };

    img.onerror = () => {
      console.error(`Failed to load image: ${tileSources[key]}`);
    };

    tileImages[key] = img;
  }
}

let playerId = null;
let players = {};

//Messages received from the server
socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === 'init') {
    playerId = msg.id;
    players = msg.players;
    
    //set pixel positions if not set
    for (const id in players) {
      const player = players[id];
      if (!player.pixelX) player.pixelX = player.mapX * TILE_SIZE;
      if (!player.pixelY) player.pixelY = player.mapY * TILE_SIZE;
      if (!player.targetX) player.targetX = player.pixelX;
      if (!player.targetY) player.targetY = player.pixelY;
    }
    
  } else if (msg.type === 'join') {
    players[msg.player.id] = msg.player;
    
    //Set pixel positions for new players
    const player = players[msg.player.id];
    if (!player.pixelX) player.pixelX = player.mapX * TILE_SIZE;
    if (!player.pixelY) player.pixelY = player.mapY * TILE_SIZE;
    if (!player.targetX) player.targetX = player.pixelX;
    if (!player.targetY) player.targetY = player.pixelY;
    
  } else if (msg.type === 'update') {
    if (!players[msg.id]) return;
    
    //Update player map position and target pixel position
    players[msg.id].mapX = msg.mapX;
    players[msg.id].mapY = msg.mapY;
    players[msg.id].targetX = msg.targetX !== undefined ? msg.targetX : msg.mapX * TILE_SIZE;
    players[msg.id].targetY = msg.targetY !== undefined ? msg.targetY : msg.mapY * TILE_SIZE;
    
    //If this is the current player, update the map too
    if (msg.id === playerId && msg.map) {
      players[playerId].map = msg.map;
    }
  } else if (msg.type === 'leave') {
    delete players[msg.id];
  }
};

const keysHeld = {};
const controls = {
  "w": "up",
  "a": "left",
  "s": "down",
  "d": "right",
  "W": "up",
  "A": "left",
  "S": "down",
  "D": "right"
}

//Handle keyboard input for player movement
window.addEventListener('keydown', (event) => {
  const dir = controls[event.key];
  if (dir) {
    keysHeld[dir] = true;
  }
});

window.addEventListener('keyup', (event) => {
  const dir = controls[event.key];
  if (dir) {
    keysHeld[dir] = false;
  }
});

setInterval(() => {
  for (let dir in keysHeld) {
    if (keysHeld[dir]) {
      socket.send(JSON.stringify({
        type: 'move',
        dir
      }));
    }
  }
}, 175);

//Function to draw all players on the canvas
let lastFrameTime = performance.now();

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function draw(currentTime) {
  const deltaTime = (currentTime - lastFrameTime) / 1000; // in seconds
  lastFrameTime = currentTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!playerId || !players[playerId]?.map) {
    requestAnimationFrame(draw);
    return;
  }

  for (const id in players) {
    const player = players[id];

    const t = Math.min(1, deltaTime * 5); 

    player.pixelX = lerp(player.pixelX, player.targetX, t);
    player.pixelY = lerp(player.pixelY, player.targetY, t);
  }

  const currentPlayer = players[playerId];
  const map = currentPlayer.map;

  const offsetX = (currentPlayer.mapX * TILE_SIZE) - currentPlayer.pixelX;
  const offsetY = (currentPlayer.mapY * TILE_SIZE) - currentPlayer.pixelY;



  if (map) {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tile = map[y][x];
        const img = tileImages[tile];
        if (img && img.complete) {
          const tileX = x * TILE_SIZE + offsetX;
          const tileY = y * TILE_SIZE + offsetY;
          ctx.drawImage(img, tileX, tileY, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }

  //Draw players
  for (const id in players) {
    const player = players[id];
    ctx.fillStyle = id === playerId ? 'white' : (player.color || 'red');

    if (id === playerId) {
      ctx.fillRect(
        (canvas.width - TILE_SIZE) / 2,
        (canvas.height - TILE_SIZE) / 2,
        TILE_SIZE,
        TILE_SIZE
      );
    } else {
      const relativeX = player.pixelX - currentPlayer.pixelX;
      const relativeY = player.pixelY - currentPlayer.pixelY;

      const screenX = (canvas.width - TILE_SIZE) / 2 + relativeX;
      const screenY = (canvas.height - TILE_SIZE) / 2 + relativeY;

      if (
        screenX > -TILE_SIZE && screenX < canvas.width &&
        screenY > -TILE_SIZE && screenY < canvas.height
      ) {
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  requestAnimationFrame(draw);
}

loadImages(() => {
  requestAnimationFrame(draw); 
});