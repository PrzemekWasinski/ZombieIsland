import { WebSocketServer } from "ws";
import http from "http";
import config from "./config.js";

const server = http.createServer();
const wss = new WebSocketServer({ server });

server.listen(8080, () => { 
  console.log("WebSocket server running"); 
});

function broadcast(data) { //Send data to all clients
  const msg = JSON.stringify(data);
  for (const client of wss.clients) {
    client.send(msg); 
  }
}

const { MOVE_SPEED, TILE_SIZE, CANVAS_HEIGHT, CANVAS_WIDTH, VISIBLE_TILES_X, VISIBLE_TILES_Y, PASSABLE_TILES, MAP } = config;

let players = {}; //All connected players
let nextId = 1; //Next player ID
let enemies = {}; //All enemies

function initialiseEnemies(enemies, amount) { //Create initial enemies
  for (let i = 1; i < amount; i++) {
    let x, y;
    x = Math.floor(Math.random() * MAP[0].length); //Random X position
    y = Math.floor(Math.random() * MAP.length);    //Random Y position
    if (!PASSABLE_TILES.includes(MAP[y][x])) { 
        continue; //Skip if not walkable
    } 
    enemies[i] = { //Create new enemies
      id: i,
      mapX: x,
      mapY: y,
      pixelX: x * TILE_SIZE,
      pixelY: y * TILE_SIZE,
      targetX: x * TILE_SIZE,
      targetY: y * TILE_SIZE,
      movingX: 0,
      movingY: 0,
      health: 100
    };
  }
}

initialiseEnemies(enemies, 100);
console.log(Object.keys(enemies).length)
wss.on('connection', (ws) => { //New player connected
  const id = nextId++;
  ws.playerId = id;
  players[id] = { //Initialize player
    id,
    mapX: 42,
    mapY: 46,
    pixelX: 42 * TILE_SIZE,
    pixelY: 46 * TILE_SIZE,
    targetX: 42 * TILE_SIZE,
    targetY: 46 * TILE_SIZE,
    health: 100,
    map: getMap(46, 42),
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    movingUp: false,
    movingDown: false,
    movingLeft: false,
    movingRight: false,
    speed: MOVE_SPEED,
    lastMapX: 42,
    lastMapY: 46
  };

  console.log(`Player ${id} connected.`);
  ws.send(JSON.stringify({ 
    type: 'init', 
    id, 
    players 
  })); //Send init data

  broadcast({ 
    type: 'join', 
    player: players[id] 
  }); //Notify others

  ws.on('message', (message) => { //Handle incoming messages
    const msg = JSON.parse(message);
    if (msg.type === 'keydown') { //Movement message
      const player = players[id];
      if (!player) { 
        return; 
      }

      if (msg.dir === 'up') { player.movingUp = msg.pressed; }
      else if (msg.dir === 'down') { player.movingDown = msg.pressed; }
      else if (msg.dir === 'left') { player.movingLeft = msg.pressed; }
      else if (msg.dir === 'right') { player.movingRight = msg.pressed; }
      else if (msg.dir === 'attack') { 
        let hasUpdated = false;

        for (const enemyID in enemies) {
          const enemy = enemies[enemyID];
          const dx = Math.abs(player.pixelX - enemy.pixelX);
          const dy = Math.abs(player.pixelY - enemy.pixelY);

          if (dx < TILE_SIZE * 1.2 && dy < TILE_SIZE * 1.2) { //If enemy in range
            enemy.health = Math.max(0, enemy.health - 3); //Damage enemy
            hasUpdated = true;
          }

          if (hasUpdated) {
            broadcast({ 
              type: 'enemy', 
              id: enemy.id, 
              mapX: enemy.mapX, 
              mapY: enemy.mapY,
              pixelX: enemy.pixelX, 
              pixelY: enemy.pixelY, 
              targetX: enemy.targetX,
              targetY: enemy.targetY, 
              health: enemy.health 
            });
          }
        }
      }
    }
  });

  ws.on('close', () => { //Player disconnected
    console.log(`Player ${id} disconnected.`);
    delete players[id];

    broadcast({ 
      type: 'leave', 
      id 
    });
  });
});

setInterval(() => { //Game loop 50 times per second
  for (const id in players) { //Update all players
    const player = players[id];
    const currentTileX = Math.floor(player.pixelX / TILE_SIZE);
    const currentTileY = Math.floor(player.pixelY / TILE_SIZE);
    let velocityX = 0;
    let velocityY = 0;
    
    if (player.movingUp) velocityY = -player.speed;
    else if (player.movingDown) velocityY = player.speed;
    if (player.movingLeft) velocityX = -player.speed;
    else if (player.movingRight) velocityX = player.speed;
    
    if (velocityX !== 0 && velocityY !== 0) { //Normalize diagonal speed
      const normalizer = 1 / Math.sqrt(2);
      velocityX *= normalizer;
      velocityY *= normalizer;
    }
    
    let newPixelX = player.pixelX + velocityX;
    let newPixelY = player.pixelY + velocityY;
    const newTileX = Math.floor(newPixelX / TILE_SIZE);
    const newTileY = Math.floor(newPixelY / TILE_SIZE);
    
    if (newTileX !== currentTileX) { //Check horizontal collision
      const checkX = newTileX;
      const checkY = currentTileY;
      if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length || 
          !PASSABLE_TILES.includes(MAP[checkY][checkX])) {
        newPixelX = velocityX > 0 ? currentTileX * TILE_SIZE + TILE_SIZE - 1 : currentTileX * TILE_SIZE;
      }
    }
    
    if (newTileY !== currentTileY) { //Check vertical collision
      const checkX = currentTileX;
      const checkY = newTileY;
      if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length || 
          !PASSABLE_TILES.includes(MAP[checkY][checkX])) {
        newPixelY = velocityY > 0 ? currentTileY * TILE_SIZE + TILE_SIZE - 1 : currentTileY * TILE_SIZE;
      }
    }
    
    if (newTileX !== currentTileX && newTileY !== currentTileY) { //Check diagonal collision
      const checkX = newTileX;
      const checkY = newTileY;
      if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length || 
          !PASSABLE_TILES.includes(MAP[checkY][checkX])) {
        newPixelX = player.pixelX;
        newPixelY = player.pixelY;
      }
    }
    
    if (newPixelX !== player.pixelX || newPixelY !== player.pixelY) { //Update position if moved
      player.pixelX = newPixelX;
      player.pixelY = newPixelY;
      player.mapX = Math.floor(player.pixelX / TILE_SIZE);
      player.mapY = Math.floor(player.pixelY / TILE_SIZE);
      player.targetX = player.pixelX;
      player.targetY = player.pixelY;
      
      let sendMap = false;
      if (player.mapX !== player.lastMapX || player.mapY !== player.lastMapY) { //Tile changed
        player.map = getMap(player.mapY, player.mapX);
        player.lastMapX = player.mapX;
        player.lastMapY = player.mapY;
        sendMap = true;
      }
      
      const ws_client = Array.from(wss.clients).find(client => client.playerId === player.id);
      if (ws_client) {
        ws_client.send(JSON.stringify({ 
          type: 'update', 
          id: player.id, 
          mapX: player.mapX,
          mapY: player.mapY, 
          pixelX: player.pixelX, 
          pixelY: player.pixelY, 
          targetX: player.targetX,
          targetY: player.targetY, 
          health: player.health, 
          map: sendMap ? 
          player.map : undefined 
        }));
      }
      
      broadcast({ 
        type: 'update', 
        id: player.id, 
        mapX: player.mapX, 
        mapY: player.mapY,
        pixelX: player.pixelX, 
        pixelY: player.pixelY, 
        targetX: player.targetX,
        targetY: player.targetY, 
        health: player.health 
      }, ws_client);
    }
    
    for (const enemyID in enemies) { //Check enemy collisions
      const enemy = enemies[enemyID];
      const dx = Math.abs(player.pixelX - enemy.pixelX);
      const dy = Math.abs(player.pixelY - enemy.pixelY);
      if (dx < TILE_SIZE * 0.8 && dy < TILE_SIZE * 0.8) { //If too close to enemy
        player.health = Math.max(0, player.health - 0.25); //Take damage
        broadcast({ 
          type: 'update', 
          id: player.id, 
          mapX: player.mapX,
          mapY: player.mapY,
          pixelX: player.pixelX,
          pixelY: player.pixelY, 
          targetX: player.targetX,
          targetY: player.targetY, 
          health: player.health 
        });
      }
    }
  }
  
  for (const enemyID in enemies) { //Update all enemies
    const enemy = enemies[enemyID];
    if (Math.random() < 0.01) { //1% chance to change direction
      const directions = ['up', 'down', 'left', 'right', 'none'];
      const randomDir = directions[Math.floor(Math.random() * directions.length)];
      enemy.movingUp = false;
      enemy.movingDown = false;
      enemy.movingLeft = false;
      enemy.movingRight = false;
      if (randomDir === 'up') enemy.movingUp = true;
      else if (randomDir === 'down') enemy.movingDown = true;
      else if (randomDir === 'left') enemy.movingLeft = true;
      else if (randomDir === 'right') enemy.movingRight = true;
    }
    
    let velocityX = 0;
    let velocityY = 0;
    if (enemy.movingUp) velocityY = -1.5;
    else if (enemy.movingDown) velocityY = 1.5;
    if (enemy.movingLeft) velocityX = -1.5;
    else if (enemy.movingRight) velocityX = 1.5;
    
    if (velocityX !== 0 && velocityY !== 0) { //Normalize diagonal speed
      const normalizer = 1 / Math.sqrt(2);
      velocityX *= normalizer;
      velocityY *= normalizer;
    }
    
    let newPixelX = enemy.pixelX + velocityX;
    let newPixelY = enemy.pixelY + velocityY;
    const currentTileX = Math.floor(enemy.pixelX / TILE_SIZE);
    const currentTileY = Math.floor(enemy.pixelY / TILE_SIZE);
    const newTileX = Math.floor(newPixelX / TILE_SIZE);
    const newTileY = Math.floor(newPixelY / TILE_SIZE);
    
    if (newTileX !== currentTileX) { //Check horizontal collision
      const checkX = newTileX;
      const checkY = currentTileY;
      if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length || 
          !PASSABLE_TILES.includes(MAP[checkY][checkX])) {
        newPixelX = velocityX > 0 ? currentTileX * TILE_SIZE + TILE_SIZE - 1 : currentTileX * TILE_SIZE;
        enemy.movingLeft = false;
        enemy.movingRight = false;
      }
    }
    
    if (newTileY !== currentTileY) { //Check vertical collision
      const checkX = currentTileX;
      const checkY = newTileY;
      if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length || !PASSABLE_TILES.includes(MAP[checkY][checkX])) {
        newPixelY = velocityY > 0 ? currentTileY * TILE_SIZE + TILE_SIZE - 1 : currentTileY * TILE_SIZE;
        enemy.movingUp = false;
        enemy.movingDown = false;
      }
    }
    
    if (newTileX !== currentTileX && newTileY !== currentTileY) { //Check diagonal collision
      const checkX = newTileX;
      const checkY = newTileY;
      if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length || !PASSABLE_TILES.includes(MAP[checkY][checkX])) {
        newPixelX = enemy.pixelX;
        newPixelY = enemy.pixelY;
        enemy.movingUp = false;
        enemy.movingDown = false;
        enemy.movingLeft = false;
        enemy.movingRight = false;
      }
    }
    
    if (newPixelX !== enemy.pixelX || newPixelY !== enemy.pixelY) { //Update enemy position
      enemy.pixelX = newPixelX;
      enemy.pixelY = newPixelY;
      enemy.mapX = Math.floor(enemy.pixelX / TILE_SIZE);
      enemy.mapY = Math.floor(enemy.pixelY / TILE_SIZE);
      enemy.targetX = enemy.pixelX;
      enemy.targetY = enemy.pixelY;

      broadcast({ 
        type: "enemy", 
        id: enemy.id, 
        mapX: enemy.mapX, 
        mapY: enemy.mapY,
        pixelX: enemy.pixelX, 
        pixelY: enemy.pixelY, 
        targetX: enemy.targetX,
        targetY: enemy.targetY, 
        health: enemy.health 
      });

      console.log(`Sent ${enemy.id}, ${enemy.mapX} ${enemy.mapY} ${enemy.pixelX} ${enemy.pixelY} ${enemy.targetX} ${enemy.targetY} ${enemy.health} to "enemy"`)
    }
  }
}, 20);

if (VISIBLE_TILES_X % 2 === 0) VISIBLE_TILES_X -= 1; //Make odd
if (VISIBLE_TILES_Y % 2 === 0) VISIBLE_TILES_Y -= 1; //Make odd

const halfY = Math.floor(VISIBLE_TILES_Y / 2); //Half visible Y
const halfX = Math.floor(VISIBLE_TILES_X / 2); //Half visible X

function getMap(mapY, mapX) { //Get visible map area
  const output = [];
  for (let i = mapY - halfY - 2; i <= mapY + halfY + 2; i++) {
    const row = [];
    for (let j = mapX - halfX - 2; j <= mapX + halfX + 2; j++) {
      try { row.push(MAP[i][j]); }
      catch { row.push(-1); } //Out of bounds
    }
    output.push(row);
  }
  return output;
}