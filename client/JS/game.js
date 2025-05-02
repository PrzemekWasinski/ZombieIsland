import { loadImages, tileImages } from "./tileSources.js";

const socket = new WebSocket('wss://ws.zombieisland.online/');

socket.onopen = () => {
  console.log("Connected to server");
};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const tileSize = 61;

let playerId = null;
let players = {};
let enemies = {}

//Messages received from the server
socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === 'init') {
    playerId = msg.id;
    players = msg.players;
    
    //set pixel positions if not set
    for (const id in players) {
      const player = players[id];
      if (!player.pixelX) player.pixelX = player.mapX * tileSize;
      if (!player.pixelY) player.pixelY = player.mapY * tileSize;
      if (!player.targetX) player.targetX = player.pixelX;
      if (!player.targetY) player.targetY = player.pixelY;
    }
    
  } else if (msg.type === 'join') {
    players[msg.player.id] = msg.player;
    
    //Set pixel positions for new players
    const player = players[msg.player.id];
    if (!player.pixelX) player.pixelX = player.mapX * tileSize;
    if (!player.pixelY) player.pixelY = player.mapY * tileSize;
    if (!player.targetX) player.targetX = player.pixelX;
    if (!player.targetY) player.targetY = player.pixelY;
    
  } else if (msg.type === 'update') {
    if (!players[msg.id]) {
      return;
    }
    
    //Update player map position and target pixel position
    players[msg.id].health = msg.health;
    players[msg.id].mapX = msg.mapX;
    players[msg.id].mapY = msg.mapY;
    players[msg.id].targetX = msg.targetX !== undefined ? msg.targetX : msg.mapX * tileSize;
    players[msg.id].targetY = msg.targetY !== undefined ? msg.targetY : msg.mapY * tileSize;
    
    //If this is the current player, update the map too
    if (msg.id === playerId && msg.map) {
      players[playerId].map = msg.map;
    }
  } else if (msg.type === 'zombie') {
    // Make sure we have an entry for this zombie
    if (!enemies) {
      enemies = {};
    }
    
    // Create or update the zombie
    if (!enemies[msg.id]) {
      enemies[msg.id] = {
        id: msg.id,
        mapX: msg.mapX,
        mapY: msg.mapY,
        pixelX: msg.pixelX || msg.mapX * tileSize,
        pixelY: msg.pixelY || msg.mapY * tileSize,
        targetX: msg.targetX || msg.mapX * tileSize,
        targetY: msg.targetY || msg.mapY * tileSize
      };
      console.log(`New zombie ${msg.id} at ${msg.mapX}, ${msg.mapY}`);
    } else {
      // Update existing zombie
      enemies[msg.id].mapX = msg.mapX;
      enemies[msg.id].mapY = msg.mapY;
      enemies[msg.id].pixelX = msg.pixelX;
      enemies[msg.id].pixelY = msg.pixelY;
      enemies[msg.id].targetX = msg.targetX;
      enemies[msg.id].targetY = msg.targetY;
    }
  } else if (msg.type === 'leave') {
    delete players[msg.id];
  }
};

const keysHeld = {};
const controls = {
  "w": "up",
  "W": "up",
  "a": "left",
  "A": "left",
  "s": "down",
  "S": "down",
  "d": "right",
  "D": "right",
  " ": "attack"
}

//Handle keyboard input for player movement
window.addEventListener('keydown', (event) => {
  const key = controls[event.key];
  if (key) {
    keysHeld[key] = true;
  }
});

window.addEventListener('keyup', (event) => {
  const key = controls[event.key];
  if (key) {
    keysHeld[key] = false;
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
}, 1);

//Function to draw all players on the canvas
let lastFrameTime = performance.now();

function tileTransition(start, end, time) {
  return start + (end - start) * time;
}

function draw(currentTime) {
  const updateTime = (currentTime - lastFrameTime) / 4000; 
  lastFrameTime = currentTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!playerId || !players[playerId]?.map) {
    requestAnimationFrame(draw);
    return;
  }

  // Changing numbers here wont make you move faster, itll only make the tile transition faster and making it lower will make character movements delayed
  for (const id in players) { 
    const player = players[id];

    const time = Math.min(1, updateTime * 10.5); 

    player.pixelX = tileTransition(player.pixelX, player.targetX, time);
    player.pixelY = tileTransition(player.pixelY, player.targetY, time);
  }
  
  // Update zombie positions with smooth transitions
  for (const id in enemies) {
    const zombie = enemies[id];
    const time = Math.min(1, updateTime * 10.5);
    
    zombie.pixelX = tileTransition(zombie.pixelX, zombie.targetX, time);
    zombie.pixelY = tileTransition(zombie.pixelY, zombie.targetY, time);
  }

  const currentPlayer = players[playerId];
  const map = currentPlayer.map;

  const offsetX = (currentPlayer.mapX * tileSize) - currentPlayer.pixelX;
  const offsetY = (currentPlayer.mapY * tileSize) - currentPlayer.pixelY;
  // Map loading will be choppy if display is set to 59.94hz. Tested and works on: 60hz, 75hz
  if (map) {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tile = map[y][x];
        const img = tileImages[tile];
        if (img && img.complete) {
          const tileX = x * tileSize + offsetX;
          const tileY = y * tileSize + offsetY;
          ctx.drawImage(img, tileX - 122, tileY - 122, tileSize, tileSize);
        }
      }
    }
  }

  // Draw players
  for (const id in players) {
    const player = players[id];
    ctx.fillStyle = id === playerId ? 'white' : (player.color || 'red');

    if (id == playerId) {
      ctx.fillRect(
        (canvas.width - tileSize) / 2,
        (canvas.height - tileSize) / 2,
        tileSize,
        tileSize
      );
      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.fillRect(((canvas.width - tileSize) / 2) + 4, ((canvas.height - tileSize) / 2) + 65, 52, 10)

      if (player.health > 0) {
        ctx.fillStyle = "rgb(255, 0, 0)"
        ctx.fillRect(((canvas.width - tileSize) / 2) + 5, ((canvas.height - tileSize) / 2) + 66, Math.round(player.health / 2), 8)
      }

    } else {
      const relativeX = player.pixelX - currentPlayer.pixelX;
      const relativeY = player.pixelY - currentPlayer.pixelY;

      const screenX = (canvas.width - tileSize) / 2 + relativeX;
      const screenY = (canvas.height - tileSize) / 2 + relativeY;

      if (
        screenX > -tileSize && screenX < canvas.width &&
        screenY > -tileSize && screenY < canvas.height
      ) {
        ctx.fillRect(screenX, screenY, tileSize, tileSize);
      }
    }
  }

  // Draw zombies with green color or zombie image
  for (const id in enemies) {
    const zombie = enemies[id];
    
    // Apply same movement logic to zombie positions for smooth animation
    const relativeX = zombie.pixelX - currentPlayer.pixelX;
    const relativeY = zombie.pixelY - currentPlayer.pixelY;

    const screenX = (canvas.width - tileSize) / 2 + relativeX;
    const screenY = (canvas.height - tileSize) / 2 + relativeY;

    if (
      screenX > -tileSize && screenX < canvas.width &&
      screenY > -tileSize && screenY < canvas.height
    ) {
      // Draw zombie (green rectangle)
      ctx.fillStyle = 'green';
      ctx.fillRect(screenX, screenY, tileSize, tileSize);
    }
  }

 

  requestAnimationFrame(draw);
}

loadImages(() => {
  requestAnimationFrame(draw); 
});