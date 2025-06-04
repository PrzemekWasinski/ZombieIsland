import { loadImages } from "./images.js";
import { drawMap, drawPlayer, drawEnemy } from "./functions.js"

export function startGame({ userId, token }) {
  const socket = new WebSocket('wss://ws.zombieisland.online/');
  socket.onopen = () => { console.log("Connected to server"); };

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const tileSize = 61; //Tile size in pixels

  let playerId = null; //Your player ID
  let players = {}; //All players
  let enemies = {}; //All enemies

  let lastFrameTime = performance.now(); //Last frame time
  let frameCount = 0;  //Frames counted
  let lastFpsUpdate = 0; //Last FPS check
  let currentFps = 0;  //Current FPS

  const TARGET_FPS = 60; //Target frames per second
  const FRAME_TIME = 1000 / TARGET_FPS; //Time per frame
  const INTERPOLATION_SPEED = 10.5; //Movement speed

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    console.log(msg.type)

    if (msg.type === 'init') { //Initial game setup
      playerId = msg.id;
      players = msg.players;
      for (const id in players) {
        const player = players[id];
        player.pixelX = Number(player.pixelX) || Number(player.mapX || 42) * tileSize;
        player.pixelY = Number(player.pixelY) || Number(player.mapY || 46) * tileSize;
        player.targetX = Number(player.targetX) || player.pixelX;
        player.targetY = Number(player.targetY) || player.pixelY;
      }

    } else if (msg.type === 'join') { //New player joined
      players[msg.player.id] = msg.player;
      const player = players[msg.player.id];
      if (!player.pixelX) player.pixelX = player.mapX * tileSize;
      if (!player.pixelY) player.pixelY = player.mapY * tileSize;
      if (!player.targetX) player.targetX = player.pixelX;
      if (!player.targetY) player.targetY = player.pixelY;

    } else if (msg.type === 'update') { //Player update
      if (!players[msg.id]) {
        return;
      } //Skip if invalid player
      const player = players[msg.id];
      player.health = Number(msg.health) || 100;
      player.mapX = Number(msg.mapX) || 42;
      player.mapY = Number(msg.mapY) || 46;
      player.pixelX = Number(msg.pixelX) || player.mapX * tileSize;
      player.pixelY = Number(msg.pixelY) || player.mapY * tileSize;
      player.targetX = Number(msg.targetX) || player.pixelX;
      player.targetY = Number(msg.targetY) || player.pixelY;

      if (msg.id === playerId && msg.map) { //Update your map
        player.map = msg.map;
      }

    } else if (msg.type === 'enemy') { //enemy update
      if (!enemies) {
        enemies = {};
      }
      if (!enemies[msg.id]) { //New enemy
        enemies[msg.id] = {
          id: msg.id,
          mapX: msg.mapX,
          mapY: msg.mapY,
          pixelX: msg.pixelX || msg.mapX * tileSize,
          pixelY: msg.pixelY || msg.mapY * tileSize,
          targetX: msg.targetX || msg.mapX * tileSize,
          targetY: msg.targetY || msg.mapY * tileSize,
          health: msg.health
        };
      } else { //Existing enemy
        const enemy = enemies[msg.id];
        enemy.mapX = msg.mapX;
        enemy.mapY = msg.mapY;
        enemy.pixelX = msg.pixelX;
        enemy.pixelY = msg.pixelY;
        enemy.targetX = msg.targetX;
        enemy.targetY = msg.targetY;
        enemy.health = msg.health;
      }
    } else if (msg.type === 'leave') { //Player left
      delete players[msg.id];
    }
  };

  const keysHeld = {};
  const controls = { //Keybindings
    "w": "up", 
    "W": "up",
    "a": "left", 
    "A": "left",
    "s": "down", 
    "S": "down",
    "d": "right", 
    "D": "right",
    " ": "attack"
  };

  window.addEventListener('keydown', (event) => { //Key pressed
    const key = controls[event.key];
    if (key && !keysHeld[key]) {
      keysHeld[key] = true;
      socket.send(JSON.stringify({
        type: 'keydown',
        dir: key,
        pressed: true
      }));
    }
  });

  window.addEventListener('keyup', (event) => { //Key released
    const key = controls[event.key];
    if (key) {
      keysHeld[key] = false;
      socket.send(JSON.stringify({
        type: 'keydown',
        dir: key,
        pressed: false
      }));
    }
  });

  function tileTransition(start, end, time) { //Smooth movement
    return start + (end - start) * time;
  }

  function draw(currentTime) { //Main game loop
    for (const enemyID in enemies) {
      const enemy = enemies[enemyID];

      if (Math.floor(enemy.health) < 1) {
        delete enemies[enemyID]
      }
    }
    frameCount++;
    if (currentTime - lastFpsUpdate >= 1000) { //Update FPS counter
      currentFps = frameCount;
      frameCount = 0;
      lastFpsUpdate = currentTime;
    }
    
    const deltaTime = Math.min(0.1, (currentTime - lastFrameTime) / 1000);
    lastFrameTime = currentTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear screen
    
    if (!playerId || !players[playerId]) { //Skip if not initialized
      requestAnimationFrame(draw);
      return;
    }
    
    const currentPlayer = players[playerId];
    const time = Math.min(1, deltaTime * INTERPOLATION_SPEED); //Movement smoothing
    
    for (const id in players) { //Update player positions
      const player = players[id];
      player.pixelX = tileTransition(player.pixelX, player.targetX, time);
      player.pixelY = tileTransition(player.pixelY, player.targetY, time);
    }
    
    for (const id in enemies) { //Update enemy positions
      const enemy = enemies[id];
      enemy.pixelX = tileTransition(enemy.pixelX, enemy.targetX, time);
      enemy.pixelY = tileTransition(enemy.pixelY, enemy.targetY, time);
    }
    
    drawMap(currentPlayer); //Draw surrounding areas
    
    for (const id in players) { //Draw other players
      if (id !== playerId) {
        drawPlayer(players[id], false, currentPlayer);
      }
    }

    for (const id in enemies) { //Draw enemies
      drawEnemy(enemies[id], currentPlayer);
    }
    
    if (players[playerId]) { //Draw you (on top)
      drawPlayer(currentPlayer, true, currentPlayer);
    }
    
    requestAnimationFrame(draw)
  }

  loadImages(() => { //Start game when images load
    requestAnimationFrame(draw);
  });
}