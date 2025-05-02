const http = require('http');
const WebSocket = require('ws');
const map = require("./map.js")

const server = http.createServer();
const wss = new WebSocket.Server({ server });

server.listen(8080, () => {
  console.log('WebSocket server running');
});

let players = {};
let nextId = 1;

let enemies = {};

const passable_tiles = [6, 7, 8, 9, 13, 15, 22, 23, 24, 25, 27, 28, 29, 31, 38, 40];

const TILE_SIZE = 61; 
const MOVE_SPEED = 5; 

function initializeZombies() {
  console.log("Initializing zombies");
  
  for (let i = 1; i < 11; i++) {
    let x, y;

    x = Math.floor(Math.random() * map[0].length);
    y = Math.floor(Math.random() * map.length);
    
    if (!passable_tiles.includes(map[y][x])) {
      continue
    }
    
    enemies[i] = {
      id: i,
      mapX: x,
      mapY: y,
      pixelX: x * TILE_SIZE,
      pixelY: y * TILE_SIZE,
      targetX: x * TILE_SIZE,
      targetY: y * TILE_SIZE
    };
  }
}

initializeZombies();

function broadcast(data) {
  const msg = JSON.stringify(data); //Convert data to a JSON string
  for (const client of wss.clients) {
    //Check if the client connection is open
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg); //Send the message
    }
  }
}

//Event listener is triggered when a new WebSocket connection is established
wss.on('connection', (ws) => {
  const id = nextId++;

  players[id] = {
    id,
    mapX: 42,
    mapY: 46,
    pixelX: 42 * TILE_SIZE, //Set initial pixel position
    pixelY: 46 * TILE_SIZE, //Set initial pixel position
    targetX: 42 * TILE_SIZE, // arget pixel position
    targetY: 46 * TILE_SIZE, //Target pixel position
    health: 100,
    map: getMap(46, 42),
    color: '#' + Math.floor(Math.random() * 16777215).toString(16)
  };

  console.log(`Player ${id} connected.`);

  //Send an initial message to the newly connected player with their ID and all current players
  ws.send(JSON.stringify({ 
    type: 'init', 
    id, 
    players 
  }));

  //Notify all other players that a new player has joined
  broadcast({ 
    type: 'join', 
    player: players[id] 
  });

  //Handle incoming messages from this client
  ws.on('message', (message) => {
    const msg = JSON.parse(message);
  
    if (msg.type === 'move') {
      const player = players[id];
      if (!player) {
        return;
      }
      
      const distanceToTarget = Math.sqrt(
        Math.pow(player.pixelX - player.targetX, 2) + 
        Math.pow(player.pixelY - player.targetY, 2)
      );
      
      //Allow movement if player is within a few pixels of target
      if (distanceToTarget <= MOVE_SPEED * 2) {
        let newMapX = player.mapX;
        let newMapY = player.mapY;
        
        //Calculate new position based on direction
        if (msg.dir === 'up') {
          newMapY -= 1;
        } else if (msg.dir === 'down') {
          newMapY += 1;
        } else if (msg.dir === 'left') {
          newMapX -= 1;
        } else if (msg.dir === 'right') {
          newMapX += 1;
        }
        
        //Check if the new position is passable
        if (newMapY >= 0 && newMapY < map.length && 
            newMapX >= 0 && newMapX < map[0].length && 
            passable_tiles.includes(map[newMapY][newMapX])) {
          
          //Update map position
          player.mapX = newMapX;
          player.mapY = newMapY;
          
          //Set target pixel position
          player.targetX = player.mapX * TILE_SIZE;
          player.targetY = player.mapY * TILE_SIZE;
          
          //Get map for current player
          let playerMap = getMap(player.mapY, player.mapX);
          
          //Send updated position to the current player with map
          ws.send(JSON.stringify({ 
            type: 'update', 
            id: id,
            mapX: player.mapX,
            mapY: player.mapY,
            pixelX: player.pixelX,
            pixelY: player.pixelY,
            targetX: player.targetX,
            targetY: player.targetY,
            map: playerMap
          }));
          
          //Broadcast position to all other clients without map
          for (const client of wss.clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ 
                type: 'update', 
                id: id,
                mapX: player.mapX,
                mapY: player.mapY,
                pixelX: player.pixelX,
                pixelY: player.pixelY,
                targetX: player.targetX,
                targetY: player.targetY
              }));
            }
          }
        }
      }
    }
  });

  //Handle the event when the client disconnects
  ws.on('close', () => {
    console.log(`Player ${id} disconnected.`);
    delete players[id]; 
    broadcast({ 
      type: 'leave', 
      id 
    }); 
  });
});


setInterval(() => {
  // Move players towards their target position
  for (const id in players) {
    const player = players[id];
    
    // Move players towards their target position
    if (player.pixelX < player.targetX) {
      player.pixelX = Math.min(player.pixelX + MOVE_SPEED, player.targetX);
    } else if (player.pixelX > player.targetX) {
      player.pixelX = Math.max(player.pixelX - MOVE_SPEED, player.targetX);
    }
    
    if (player.pixelY < player.targetY) {
      player.pixelY = Math.min(player.pixelY + MOVE_SPEED, player.targetY);
    } else if (player.pixelY > player.targetY) {
      player.pixelY = Math.max(player.pixelY - MOVE_SPEED, player.targetY);
    }
    for (const zombieId in enemies) {
      const zombie = enemies[zombieId]

      if (
        player.mapX == zombie.mapX + 1 && player.mapY == zombie.mapY ||
        player.mapX == zombie.mapX - 1 && player.mapY == zombie.mapY ||
        player.mapX == zombie.mapX && player.mapY == zombie.mapY + 1 ||
        player.mapX == zombie.mapX && player.mapY == zombie.mapY - 1
      ) {
        player.health -= 0.03
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
      });
    }
  }
  
  // Move zombies randomly with improved logic
  for (const zombieId in enemies) {
    const zombie = enemies[zombieId];
    
    // Move zombies towards their target position
    if (zombie.pixelX < zombie.targetX) {
      zombie.pixelX = Math.min(zombie.pixelX + MOVE_SPEED * 0.5, zombie.targetX);
    } else if (zombie.pixelX > zombie.targetX) {
      zombie.pixelX = Math.max(zombie.pixelX - MOVE_SPEED * 0.5, zombie.targetX);
    }
    
    if (zombie.pixelY < zombie.targetY) {
      zombie.pixelY = Math.min(zombie.pixelY + MOVE_SPEED * 0.5, zombie.targetY);
    } else if (zombie.pixelY > zombie.targetY) {
      zombie.pixelY = Math.max(zombie.pixelY - MOVE_SPEED * 0.5, zombie.targetY);
    }
    
    // Check if zombie is at or close to its target
    const distanceToTarget = Math.sqrt(
      Math.pow(zombie.pixelX - zombie.targetX, 2) + 
      Math.pow(zombie.pixelY - zombie.targetY, 2)
    );
    
    // Only try to move if we're close to the target position
    if (distanceToTarget <= MOVE_SPEED) {
      // Try all directions in a random order
      const directions = ['up', 'down', 'left', 'right'];
      // Shuffle array for true randomness
      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
      }
      
      let moved = false;
      
      // Try each direction until we find a valid move
      for (const randomDir of directions) {
        if (moved) {
          break;
        }
        
        let newMapX = zombie.mapX;
        let newMapY = zombie.mapY;
        
        // Calculate new position based on direction
        if (randomDir === 'up') {
          newMapY -= 1;
        } else if (randomDir === 'down') {
          newMapY += 1;
        } else if (randomDir === 'left') {
          newMapX -= 1;
        } else if (randomDir === 'right') {
          newMapX += 1;
        }
        
        // Check if the new position is passable
        if (newMapY >= 0 && newMapY < map.length && 
            newMapX >= 0 && newMapX < map[0].length && 
            passable_tiles.includes(map[newMapY][newMapX])) {
          
          // Update map position
          zombie.mapX = newMapX;
          zombie.mapY = newMapY;
          
          // Set target pixel position
          zombie.targetX = zombie.mapX * TILE_SIZE;
          zombie.targetY = zombie.mapY * TILE_SIZE;
    
          moved = true;
        }
      }
    }
    
    // Broadcast zombie positions to all clients
    broadcast({ 
      type: 'zombie', 
      id: zombie.id,
      mapX: zombie.mapX,
      mapY: zombie.mapY,
      pixelX: zombie.pixelX,
      pixelY: zombie.pixelY,
      targetX: zombie.targetX,
      targetY: zombie.targetY
    });
  }
}, 20);

//Calculating player's surrounding area

const CANVAS_WIDTH = 1891;
const CANVAS_HEIGHT = 1037;

// Calculate the number of visible tiles
let VISIBLE_TILES_X = Math.ceil(CANVAS_WIDTH / TILE_SIZE);
let VISIBLE_TILES_Y = Math.ceil(CANVAS_HEIGHT / TILE_SIZE);

// Ensure both values are odd (this ensures the player is centered)
if (VISIBLE_TILES_X % 2 === 0) VISIBLE_TILES_X -= 1; // Ensure odd width
if (VISIBLE_TILES_Y % 2 === 0) VISIBLE_TILES_Y -= 1; // Ensure odd height

console.log(`Visible tiles (X): ${VISIBLE_TILES_X}`); // Should be 31
console.log(`Visible tiles (Y): ${VISIBLE_TILES_Y}`); // Should be 17

const halfY = Math.floor(VISIBLE_TILES_Y / 2);
const halfX = Math.floor(VISIBLE_TILES_X / 2);

function getMap(mapY, mapX) {
  const output = [];
  for (let i = mapY - halfY - 2; i <= mapY + halfY + 2; i++) {
    const row = [];
    for (let j = mapX - halfX - 2; j <= mapX + halfX + 2; j++) {
      try {
        row.push(map[i][j]);
      } catch {
        row.push(-1); // Fallback for out-of-bounds tiles
      }
    }
    output.push(row);
  }
  return output;
}



