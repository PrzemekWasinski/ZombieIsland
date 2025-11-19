import { players, enemies, enemyNextID, drops, getNextDropID, getNextEnemyID, objects, getNextObjectID } from "./state.js";
import { broadcast, spawnEnemy, getMap, isNearby, spawnDrop, updateStats, saveProgress, saveItem, spawnObject, broadcastToNearby, sendNearbyObjects } from "./functions.js";

export function startGame(wss, TILE_SIZE, VISIBLE_TILES_X, VISIBLE_TILES_Y, PASSABLE_TILES, PLAYER_SPAWN, ENEMY_SPAWNS, OBJECT_SPAWNS, MAP, supabase, biomes) {
    let locationData = {};
    let objectData = {};

    for (const key of Object.keys(ENEMY_SPAWNS)) {
        locationData[key] = 0;
    }

    for (const key of Object.keys(OBJECT_SPAWNS)) {
        objectData[key] = 0;
    }


    let newDrops = new Set();
    let newObjects = new Set();
    let updatedEnemies = new Set();

    setInterval(() => {
        //Clear tracking sets at start of each tick
        newDrops.clear();
        newObjects.clear();
        updatedEnemies.clear();

        //Clean up old chat messages (older than 5 seconds)
        const currentTime = Date.now();
        const MESSAGE_LIFETIME = 5000; // 5 seconds
        for (const id in players) {
            const player = players[id];
            if (player.messages && player.messages.length > 0) {
                player.messages = player.messages.filter(msg =>
                    currentTime - msg.timestamp < MESSAGE_LIFETIME
                );
            }
        }

        //Handle dead enemies
        const deadEnemies = Object.keys(enemies).filter(id => enemies[id].health <= 0);
        const deadObjects = Object.keys(objects).filter(id => objects[id].health <= 0);

        for (const id of deadEnemies) {
            const enemy = enemies[id];
            const loc = enemy.location;
            locationData[loc]--;

            const rand = Math.floor(Math.random() * 100) + 1; 

            for (let i = 0; i < ENEMY_SPAWNS[loc].enemyStats.possibleDrops.length; i++) {
                let possibleDrop = ENEMY_SPAWNS[loc].enemyStats.possibleDrops[i]

                if (rand < possibleDrop.chance) {
                    const dropID = getNextDropID();
                    spawnDrop(possibleDrop, enemy.pixelX, enemy.pixelY, dropID, drops, TILE_SIZE);
                    newDrops.add(dropID); //Track new drop
                }
            }

            delete enemies[id];
        }

        for (const id of deadObjects) {
            const object = objects[id];
            const loc = object.location;
            objectData[loc]--;

            const rand = Math.floor(Math.random() * 100) + 1; 
            for (let i = 0; i < OBJECT_SPAWNS[loc].objectStats.possibleDrops.length; i++) {
                let possibleDrop = OBJECT_SPAWNS[loc].objectStats.possibleDrops[i]
                
                if (rand < possibleDrop.chance) {
                    const dropID = getNextDropID();
                    spawnDrop(possibleDrop, object.pixelX, object.pixelY, dropID, drops, TILE_SIZE);
                    newDrops.add(dropID); // Track new drop
                }
            }

            delete objects[id];
        }

        //Broadcast only NEW drops 
        for (const dropID of newDrops) {
    		const drop = drops[dropID];
    		if (drop) {
    			broadcastToNearby(drop, {
    				type: "drop",
    				id: drop.id,
    				name: drop.name,
    				mapX: drop.mapX,
    				mapY: drop.mapY,
    				pixelX: drop.pixelX,
    				pixelY: drop.pixelY,
    			}, wss, players);
    		}
        }

        //Spawn enemies if needed
        const spawnKeys = Object.keys(ENEMY_SPAWNS);
        const objectKeys = Object.keys(OBJECT_SPAWNS);

        for (const key of spawnKeys) {
            const spawnData = ENEMY_SPAWNS[key];
            let tries = 0;

            while (locationData[key] < spawnData.enemyAmount && tries < 10) {
                const newID = spawnEnemy(enemies, PASSABLE_TILES, MAP, getNextEnemyID(), TILE_SIZE, spawnData.biome, key, spawnData.enemyStats, biomes);
                if (newID !== null) {
                    locationData[key]++;
                }
                tries++;
            }
        }

        for (const key of objectKeys) {
            const spawnData = OBJECT_SPAWNS[key];
            let tries = 0;

            while (objectData[key] < spawnData.objectAmount && tries < 10) {
                const newID = spawnObject(objects, PASSABLE_TILES, MAP, getNextObjectID(), TILE_SIZE, spawnData.biome, key, spawnData.objectStats, biomes);
                if (newID !== null) {
                    newObjects.add(newID);
                    objectData[key]++;
                }
                tries++;
            }
        }

        //Broadcast only new objects
        for (const objectID of newObjects) {
            const object = objects[objectID];
            if (object) {
                broadcastToNearby(object, {
                    type: "object",
                    id: object.id,
                    mapX: object.mapX,
                    mapY: object.mapY,
                    pixelX: object.pixelX,
                    pixelY: object.pixelY,
                    health: object.health,
                    maxHealth: object.maxHealth,
                    name: object.name,
                }, wss, players);
            }
        }



        for (const id in players) { //Update all players
            const player = players[id];

            let playerMoved = false; //Track if player  moved

            for (let i = player.messages.length - 1; i >= 0; i--) {
                if (player.messages[i] && Date.now() - player.messages[i].timestamp > 3000) {
                    player.messages.splice(i, 1);
                }
            }

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

            //Check horizontal movement
            if (newTileX !== currentTileX) {
                const checkX = newTileX;
                const checkY = currentTileY;

                //Check bounds
                if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length) {
                    newPixelX = velocityX > 0 ? currentTileX * TILE_SIZE + TILE_SIZE - 1 : currentTileX * TILE_SIZE;
                } else {
                    const nextTile = MAP[checkY][checkX];
                    const isWater = nextTile === 0;
                    let isPassable = PASSABLE_TILES.includes(nextTile);

                    for (const id in objects) {
                        const object = objects[id];
                        if (object.mapX === checkX && object.mapY === checkY) {
                            isPassable = false;
                        }
                    }

                    //Movement rules based on boat state
                    if (player.inBoat) {
                        // In boatcan only move on water 
                        if (!isWater) {
                            newPixelX = velocityX > 0 ? currentTileX * TILE_SIZE + TILE_SIZE - 1 : currentTileX * TILE_SIZE;
                        }
                    } else {
                        // On land can only move on passable tiles 
                        if (!isPassable || isWater) {
                            newPixelX = velocityX > 0 ? currentTileX * TILE_SIZE + TILE_SIZE - 1 : currentTileX * TILE_SIZE;
                        }
                    }
                }
            }

            //Check vertical movement
            if (newTileY !== currentTileY) {
                const checkX = currentTileX;
                const checkY = newTileY;

                //Check bounds
                if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length) {
                    newPixelY = velocityY > 0 ? currentTileY * TILE_SIZE + TILE_SIZE - 1 : currentTileY * TILE_SIZE;
                } else {
                    const nextTile = MAP[checkY][checkX];
                    const isWater = nextTile === 0;
                    let isPassable = PASSABLE_TILES.includes(nextTile);

                    for (const id in objects) {
                        const object = objects[id];
                        if (object.mapX === checkX && object.mapY === checkY) {
                            isPassable = false;
                        }
                    }

                    //Movement rules based on boat state
                    if (player.inBoat) {
                        if (!isWater) {
                            newPixelY = velocityY > 0 ? currentTileY * TILE_SIZE + TILE_SIZE - 1 : currentTileY * TILE_SIZE;
                        }
                    } else {
                        if (!isPassable || isWater) {
                            newPixelY = velocityY > 0 ? currentTileY * TILE_SIZE + TILE_SIZE - 1 : currentTileY * TILE_SIZE;
                        }
                    }
                }
            }

            //Check diagonal movement
            if (newTileX !== currentTileX && newTileY !== currentTileY) {
                const checkX = newTileX;
                const checkY = newTileY;

                //Check bounds
                if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length) {
                    newPixelX = player.pixelX;
                    newPixelY = player.pixelY;
                } else {
                    const nextTile = MAP[checkY][checkX];
                    const isWater = nextTile === 0;
                    let isPassable = PASSABLE_TILES.includes(nextTile);

                    for (const id in objects) {
                        const object = objects[id];
                        if (object.mapX === checkX && object.mapY === checkY) {
                            isPassable = false;
                        }
                    }

                    //Movement rules based on boat state
                    if (player.inBoat) {
                        if (!isWater) {
                            newPixelX = player.pixelX;
                            newPixelY = player.pixelY;
                        }
                    } else {
                        if (!isPassable || isWater) {
                            newPixelX = player.pixelX;
                            newPixelY = player.pixelY;
                        }
                    }
                }
            }

            if (newPixelX !== player.pixelX || newPixelY !== player.pixelY) { //Update position if moved
                player.pixelX = newPixelX;
                player.pixelY = newPixelY;
                player.mapX = Math.floor(player.pixelX / TILE_SIZE);
                player.mapY = Math.floor(player.pixelY / TILE_SIZE);
                player.targetX = player.pixelX;
                player.targetY = player.pixelY;
                playerMoved = true;
            }

            if (Math.floor(player.health) < 1) {
                player.mapX = PLAYER_SPAWN[0]
                player.mapY = PLAYER_SPAWN[1]
                player.pixelX = (PLAYER_SPAWN[0] * TILE_SIZE) + (Math.floor(TILE_SIZE / 2))
                player.pixelY = (PLAYER_SPAWN[1] * TILE_SIZE) + (Math.floor(TILE_SIZE / 2))
                player.targetX = (PLAYER_SPAWN[0] * TILE_SIZE) + (Math.floor(TILE_SIZE / 2))
                player.targetY = (PLAYER_SPAWN[1] * TILE_SIZE) + (Math.floor(TILE_SIZE / 2))
                player.health = player.maxHealth;
                player.inBoat = false; 
                playerMoved = true; 
            }

            let sendMap = false;
            player.map = getMap(player.mapY, player.mapX, MAP, VISIBLE_TILES_X, VISIBLE_TILES_Y);
            player.lastMapX = player.mapX;
            player.lastMapY = player.mapY;
            sendMap = true;

            const ws_client = player.ws;
            if (ws_client && ws_client.readyState === 1) {
                const selfUpdatePayload = {
                    type: "update",
                    id: player.id,
                    mapX: player.mapX,
                    mapY: player.mapY,
                    pixelX: player.pixelX,
                    pixelY: player.pixelY,
                    targetX: player.targetX,
                    targetY: player.targetY,
                    map: sendMap ? player.map : undefined,
                    health: player.health,
                    username: player.username,
                    level: player.level,
                    gold: player.gold,
                    inBoat: player.inBoat, 
                    messages: player.messages,
                    inventory: player.inventory
                };
                ws_client.send(JSON.stringify(selfUpdatePayload));
            }

            //Only broadcast to other players if this player moved or health changed
            if (playerMoved || player.healthChanged) {
                const othersUpdatePayload = {
                    type: "update",
                    id: player.id,
                    mapX: player.mapX,
                    mapY: player.mapY,
                    pixelX: player.pixelX,
                    pixelY: player.pixelY,
                    targetX: player.targetX,
                    targetY: player.targetY,
                    health: player.health,
                    username: player.username,
                    level: player.level,
                    gold: player.gold,
                    inBoat: player.inBoat, 
                    messages: player.messages,
                    //No inventory for others
                };
                broadcast(othersUpdatePayload, wss, ws_client);
                sendNearbyObjects(players[id], objects, wss)

                player.healthChanged = false;
            }

            // Handle enemy collisionsaaa
            for (const enemyID in enemies) {
                const enemy = enemies[enemyID];
                const dx = Math.abs(player.pixelX - enemy.pixelX);
                const dy = Math.abs(player.pixelY - enemy.pixelY);
                if (dx < TILE_SIZE && dy < TILE_SIZE) { //If too close to enemy
                    const oldHealth = player.health;
                    player.health = Math.max(0, player.health - enemy.damage); //Take damage
                    
                    //Only broadcast if health actually changed
                    if (player.health !== oldHealth) {
                        player.healthChanged = true;
                        updatedEnemies.add(enemyID); //Mark enemy for broadcast
                    }
                }
            }
        }

        for (const enemyID in enemies) { //Update all enemies
            const enemy = enemies[enemyID];
            let nearPLayer = false
            let targetDistance = undefined;
            let targetX = 0
            let targetY = 0

            for (const playerID in players) {
                const player = players[playerID]
                if (isNearby([enemy.mapX, enemy.mapY], [player.mapX, player.mapY])) {
                    nearPLayer = true
                    let distanceX, distanceY;

                    if (enemy.mapX >= player.mapX) {
                        distanceX = enemy.mapX - player.mapX;
                    } else {
                        distanceX = player.mapX - enemy.mapX
                    }

                    if (enemy.mapY >= player.mapY) {
                        distanceY = enemy.mapY - player.mapY;
                    } else {
                        distanceY = player.mapY - enemy.mapY
                    }

                    if (targetDistance === undefined || distanceX + distanceY < targetDistance) {
                        targetDistance = distanceX + distanceY;
                        targetX = player.mapX;
                        targetY = player.mapY;
                    }
                }
            }

            if (!nearPLayer) {
                continue;
            }

            const STOP_DISTANCE = 0;

            // Store old position
            const oldPixelX = enemy.pixelX;
            const oldPixelY = enemy.pixelY;

            // Clear previous movement
            enemy.movingUp = false;
            enemy.movingDown = false;
            enemy.movingLeft = false;
            enemy.movingRight = false;
            enemy.movingUpRight = false;
            enemy.movingUpLeft = false;
            enemy.movingDownRight = false;
            enemy.movingDownLeft = false;

            if (targetDistance !== undefined && targetDistance > STOP_DISTANCE) {
                // Move toward player only if not already close enough
                if (targetX > enemy.mapX && targetY > enemy.mapY) { 
                    enemy.movingDownRight = true; 
                    enemy.direction = "down-right";
                } else if (targetX < enemy.mapX && targetY < enemy.mapY) { 
                    enemy.movingUpLeft = true; 
                    enemy.direction = "up-left";
                } else if (targetX > enemy.mapX && targetY < enemy.mapY) { 
                    enemy.movingUpRight = true; 
                    enemy.direction = "up-right";
                } else if (targetX < enemy.mapX && targetY > enemy.mapY) { 
                    enemy.movingDownLeft = true;
                    enemy.direction = "down-left"; 
                } else if (targetX === enemy.mapX && targetY > enemy.mapY) { 
                    enemy.movingDown = true; 
                    enemy.direction = "down";
                } else if (targetX === enemy.mapX && targetY < enemy.mapY) { 
                    enemy.movingUp = true; 
                    enemy.direction = "up";
                } else if (targetY === enemy.mapY && targetX > enemy.mapX) { 
                    enemy.movingRight = true; 
                    enemy.direction = "right";
                } else if (targetY === enemy.mapY && targetX < enemy.mapX) { 
                    enemy.movingLeft = true;
                    enemy.direction = "left";
                }
            }
            
            let velocityX = 0;
            let velocityY = 0;

            if (enemy.movingLeft || enemy.movingDownLeft || enemy.movingUpLeft) {
                velocityX = -enemy.speed;
            } else if (enemy.movingRight || enemy.movingDownRight || enemy.movingUpRight) {
                velocityX = enemy.speed;
            }

            if (enemy.movingUp || enemy.movingUpLeft || enemy.movingUpRight) {
                velocityY = -enemy.speed;
            } else if (enemy.movingDown || enemy.movingDownLeft || enemy.movingDownRight) {
                velocityY = enemy.speed;
            }

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

                const isBlockedCoordinate =
                    (checkY === 1301 && checkX === 1009) ||
                    (checkY === 1300 && checkX === 1009) ||
                    (checkY === 1299 && checkX === 1009);

                if (
                    checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length ||
                    !PASSABLE_TILES.includes(MAP[checkY][checkX]) ||
                    isBlockedCoordinate
                ) {
                    newPixelX = velocityX > 0 ? currentTileX * TILE_SIZE + TILE_SIZE - 1 : currentTileX * TILE_SIZE;
                    enemy.movingLeft = false;
                    enemy.movingRight = false;
                    enemy.movingUpLeft = false;
                    enemy.movingUpRight = false;
                    enemy.movingDownRight = false;
                    enemy.movingDownLeft = false;
                }
            }

            if (newTileY !== currentTileY) { //Check vertical collision
                const checkX = currentTileX;
                const checkY = newTileY;

                const isBlockedCoordinate =
                    (checkY === 1301 && checkX === 1009) ||
                    (checkY === 1300 && checkX === 1009) ||
                    (checkY === 1299 && checkX === 1009);

                if (
                    checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length ||
                    !PASSABLE_TILES.includes(MAP[checkY][checkX]) ||
                    isBlockedCoordinate
                ) {
                    newPixelY = velocityY > 0 ? currentTileY * TILE_SIZE + TILE_SIZE - 1 : currentTileY * TILE_SIZE;
                    enemy.movingUp = false;
                    enemy.movingDown = false;
                    enemy.movingUpLeft = false;
                    enemy.movingUpRight = false;
                    enemy.movingDownRight = false;
                    enemy.movingDownLeft = false;
                }
            }

            if (newTileX !== currentTileX && newTileY !== currentTileY) { //Check diagonal collision
                const checkX = newTileX;
                const checkY = newTileY;

                if (
                    checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length ||
                    !PASSABLE_TILES.includes(MAP[checkY][checkX])
                ) {
                    newPixelX = enemy.pixelX;
                    newPixelY = enemy.pixelY;
                    enemy.movingUp = false;
                    enemy.movingDown = false;
                    enemy.movingLeft = false;
                    enemy.movingRight = false;
                    enemy.movingUpLeft = false;
                    enemy.movingUpRight = false;
                    enemy.movingDownRight = false;
                    enemy.movingDownLeft = false;
                }
            }

            if (nearPLayer) {
                //Only broadcast if enemy actually moved or was marked for update
                if ((newPixelX !== oldPixelX || newPixelY !== oldPixelY) || updatedEnemies.has(enemyID)) {
                    enemy.pixelX = newPixelX;
                    enemy.pixelY = newPixelY;
                    enemy.mapX = Math.floor(enemy.pixelX / TILE_SIZE);
                    enemy.mapY = Math.floor(enemy.pixelY / TILE_SIZE);
                    enemy.targetX = enemy.pixelX;
                    enemy.targetY = enemy.pixelY;

                    const action = updatedEnemies.has(enemyID) ? "attack" : "walk";

                    broadcastToNearby(enemy, {
                        type: "enemy",
                        id: enemy.id,
                        mapX: enemy.mapX,
                        mapY: enemy.mapY,
                        pixelX: enemy.pixelX,
                        pixelY: enemy.pixelY,
                        targetX: enemy.targetX,
                        targetY: enemy.targetY,
                        health: enemy.health,
                        maxHealth: enemy.maxHealth,
                        name: enemy.name,
                        level: enemy.level,
                        direction: enemy.direction,
                        action: action
                    }, wss, players);
                }
            }
        }

        let deadDrops = []

        for (const dropID in drops) {
            const drop = drops[dropID]
            let pickedUp = false;

            for (const playerID in players) {
                const player = players[playerID]
                const dx = Math.abs(player.pixelX - drop.pixelX);
                const dy = Math.abs(player.pixelY - drop.pixelY);
                if (dx < TILE_SIZE * 0.4 && dy < TILE_SIZE * 0.4) {
                    if (player.health > player.maxHealth - 10) {
                        player.health = player.maxHealth
                    } else {
                        player.health += 10
                    }

                    //Update inventory in memory
                    player.healthChanged = true;

                    if (!player.inventory[drop.name]) {
                        player.inventory[drop.name] = {
                            itemName: drop.name,
                            itemAmount : 1
                        };
                    } else {
                        player.inventory[drop.name].itemAmount++;
                    }
                    
                    //Save immediately to database
                    saveItem(drop.name, player.dbID, supabase);
                    deadDrops.push(dropID);

                    // Send inventory update only to this player
                    if (player.ws && player.ws.readyState === 1) {
                        player.ws.send(JSON.stringify({
                            type: "update",
                            id: player.id,
                            inventory: player.inventory
                        }));
                    }

                    pickedUp = true;
                    break; //One player picks it up
                }
            }
        }

        for (let i = 0; i < deadDrops.length; i++) {
            const dropID = deadDrops[i];
            const drop = drops[dropID];

            // Broadcast drop deletion to nearby players
            if (drop) {
                broadcastToNearby(drop, {
                    type: "dropDelete",
                    id: dropID
                }, wss, players);
            }

            delete drops[dropID];
        }
    }, 20);

    setInterval(() => { 
        for (const id in players) {
            const player = players[id];
            saveProgress(player, supabase);
    }
    }, 5_000);
}