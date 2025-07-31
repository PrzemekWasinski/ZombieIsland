import { players, enemies, enemyNextID, drops, getNextDropID, getNextEnemyID, objects, getNextObjectID } from "./state.js";
import { broadcast, spawnEnemy, getMap, isNearby, spawnDrop, updateStats, saveProgress, saveItem, spawnObject } from "./functions.js";

export function startGame(wss, TILE_SIZE, VISIBLE_TILES_X, VISIBLE_TILES_Y, PASSABLE_TILES, PLAYER_SPAWN, ENEMY_SPAWNS, OBJECT_SPAWNS, MAP, supabase) {
    let locationData = {};
    let objectData = {};

    for (const key of Object.keys(ENEMY_SPAWNS)) {
        locationData[key] = 0;
    }

    for (const key of Object.keys(OBJECT_SPAWNS)) {
        objectData[key] = 0;
    }

    setInterval(() => {
        // 1. Handle dead enemies
        const deadEnemies = Object.keys(enemies).filter(id => enemies[id].health <= 0);
        const deadObjects = Object.keys(objects).filter(id => objects[id].health <= 0);

        for (const id of deadEnemies) {
            const enemy = enemies[id];
            const loc = enemy.location;
            locationData[loc]--;

            const rand = Math.floor(Math.random() * 100) + 1; //1–100

            for (let i = 0; i < ENEMY_SPAWNS[loc].enemyStats.possibleDrops.length; i++) {
                let possibleDrop = ENEMY_SPAWNS[loc].enemyStats.possibleDrops[i]

                if (rand < possibleDrop.chance) {
                    const dropID = getNextDropID();
                    spawnDrop(possibleDrop, enemy.pixelX, enemy.pixelY, dropID, drops, TILE_SIZE);
                }
            }

            delete enemies[id];
        }

        for (const id of deadObjects) {
            const object = objects[id];
            const loc = object.location;
            objectData[loc]--;

            const rand = Math.floor(Math.random() * 100) + 1; // 1–100 inclusive
            for (let i = 0; i < OBJECT_SPAWNS[loc].objectStats.possibleDrops.length; i++) {
                let possibleDrop = OBJECT_SPAWNS[loc].objectStats.possibleDrops[i]
                
                if (rand < possibleDrop.chance) {
                    const dropID = getNextDropID();
                    spawnDrop(possibleDrop, object.pixelX, object.pixelY, dropID, drops, TILE_SIZE);
                }
            }

            delete objects[id];
        }

        // 2. Broadcast drops
        for (const id in drops) {
            const drop = drops[id];
            broadcast({
                type: "drop",
                id: drop.id,
                name: drop.name,
                mapX: drop.mapX,
                mapY: drop.mapY,
                pixelX: drop.pixelX,
                pixelY: drop.pixelY,
            }, wss);
        }

        // 3. Spawn enemies if needed
        const spawnKeys = Object.keys(ENEMY_SPAWNS);
        const objectKeys = Object.keys(OBJECT_SPAWNS);

        for (const key of spawnKeys) {
            const spawnData = ENEMY_SPAWNS[key];
            let tries = 0;

            while (locationData[key] < spawnData.enemyAmount && tries < 10) {
                const newID = spawnEnemy(enemies, PASSABLE_TILES, MAP, getNextEnemyID(), TILE_SIZE, spawnData.topLeft, spawnData.bottomRight, key, spawnData.enemyStats);
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
                const newID = spawnObject(objects, PASSABLE_TILES, MAP, getNextObjectID(), TILE_SIZE, spawnData.topLeft, spawnData.bottomRight, key, spawnData.objectStats);
                if (newID !== null) {
                    objectData[key]++;
                }
                tries++;
            }
        }

        for (const id in objects) {
            const object = objects[id];
            broadcast({
                type: "object",
                id: object.id,
                mapX: object.mapX,
                mapY: object.mapY,
                pixelX: object.pixelX,
                pixelY: object.pixelY,
                health: object.health[0],
                maxHealth: object.health[1],
                location: object.location,
                name: object.name
            }, wss);
        }

        for (const id in players) { //Update all players
            const player = players[id];

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

            // Check horizontal movement
            if (newTileX !== currentTileX) {
                const checkX = newTileX;
                const checkY = currentTileY;

                // Check bounds
                if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length) {
                    newPixelX = velocityX > 0 ? currentTileX * TILE_SIZE + TILE_SIZE - 1 : currentTileX * TILE_SIZE;
                } else {
                    const nextTile = MAP[checkY][checkX];
                    const isWater = nextTile === 31;
                    const isPassable = PASSABLE_TILES.includes(nextTile);

                    // Movement rules based on boat state
                    if (player.inBoat) {
                        // In boat: can only move on water (tile 31)
                        if (!isWater) {
                            newPixelX = velocityX > 0 ? currentTileX * TILE_SIZE + TILE_SIZE - 1 : currentTileX * TILE_SIZE;
                        }
                    } else {
                        // On land: can only move on passable tiles (not water)
                        if (!isPassable || isWater) {
                            newPixelX = velocityX > 0 ? currentTileX * TILE_SIZE + TILE_SIZE - 1 : currentTileX * TILE_SIZE;
                        }
                    }
                }
            }

            // Check vertical movement
            if (newTileY !== currentTileY) {
                const checkX = currentTileX;
                const checkY = newTileY;

                // Check bounds
                if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length) {
                    newPixelY = velocityY > 0 ? currentTileY * TILE_SIZE + TILE_SIZE - 1 : currentTileY * TILE_SIZE;
                } else {
                    const nextTile = MAP[checkY][checkX];
                    const isWater = nextTile === 31;
                    const isPassable = PASSABLE_TILES.includes(nextTile);

                    // Movement rules based on boat state
                    if (player.inBoat) {
                        // In boat: can only move on water (tile 31)
                        if (!isWater) {
                            newPixelY = velocityY > 0 ? currentTileY * TILE_SIZE + TILE_SIZE - 1 : currentTileY * TILE_SIZE;
                        }
                    } else {
                        // On land: can only move on passable tiles (not water)
                        if (!isPassable || isWater) {
                            newPixelY = velocityY > 0 ? currentTileY * TILE_SIZE + TILE_SIZE - 1 : currentTileY * TILE_SIZE;
                        }
                    }
                }
            }

            // Check diagonal movement
            if (newTileX !== currentTileX && newTileY !== currentTileY) {
                const checkX = newTileX;
                const checkY = newTileY;

                // Check bounds
                if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length) {
                    newPixelX = player.pixelX;
                    newPixelY = player.pixelY;
                } else {
                    const nextTile = MAP[checkY][checkX];
                    const isWater = nextTile === 31;
                    const isPassable = PASSABLE_TILES.includes(nextTile);

                    // Movement rules based on boat state
                    if (player.inBoat) {
                        // In boat: can only move on water (tile 31)
                        if (!isWater) {
                            newPixelX = player.pixelX;
                            newPixelY = player.pixelY;
                        }
                    } else {
                        // On land: can only move on passable tiles (not water)
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
            }

            // Rest of your player update code (health check, map updates, etc.)
            if (Math.floor(player.health) < 1) {
                player.mapX = PLAYER_SPAWN[0]
                player.mapY = PLAYER_SPAWN[1]
                player.pixelX = (PLAYER_SPAWN[0] * TILE_SIZE) + (Math.floor(TILE_SIZE / 2))
                player.pixelY = (PLAYER_SPAWN[1] * TILE_SIZE) + (Math.floor(TILE_SIZE / 2))
                player.targetX = (PLAYER_SPAWN[0] * TILE_SIZE) + (Math.floor(TILE_SIZE / 2))
                player.targetY = (PLAYER_SPAWN[1] * TILE_SIZE) + (Math.floor(TILE_SIZE / 2))
                player.health = 100
                player.inBoat = false; // Reset boat state when respawning
            }

            let sendMap = false;
            player.map = getMap(player.mapY, player.mapX, MAP, VISIBLE_TILES_X, VISIBLE_TILES_Y);
            player.lastMapX = player.mapX;
            player.lastMapY = player.mapY;
            sendMap = true;

            const ws_client = Array.from(wss.clients).find(client => client.playerId === player.id);
            if (ws_client) {
                ws_client.send(JSON.stringify({
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
                    name: player.name,
                    inBoat: player.inBoat, // Include boat state in updates
                    messages: player.messages,
                    inventory: player.inventory
                }));
            }

            broadcast({
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
                inBoat: player.inBoat, // Include boat state in broadcasts
                messages: player.messages,
                inventory: player.inventory
            }, wss, ws_client);


            for (const enemyID in enemies) { //Check enemy collisions
                const enemy = enemies[enemyID];
                const dx = Math.abs(player.pixelX - enemy.pixelX);
                const dy = Math.abs(player.pixelY - enemy.pixelY);
                if (dx < TILE_SIZE * 0.8 && dy < TILE_SIZE * 0.8) { //If too close to enemy
                    player.health = Math.max(0, player.health - enemy.damage); //Take damage
                    broadcast({
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
                        name: player.name,
                        inventory: player.inventory
                    }, wss);
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

            const STOP_DISTANCE = 1;

            if (nearPLayer) {
                const spawn = ENEMY_SPAWNS[enemy.location];
                const topLeft = spawn.topLeft;
                const bottomRight = spawn.bottomRight;

                const canMoveUp = enemy.mapY - 1 >= topLeft[1];
                const canMoveDown = enemy.mapY + 1 <= bottomRight[1];
                const canMoveLeft = enemy.mapX - 1 >= topLeft[0];
                const canMoveRight = enemy.mapX + 1 <= bottomRight[0];

                const directions = [];

                if (canMoveUp) { directions.push("up"); }
                if (canMoveDown) { directions.push("down"); }
                if (canMoveLeft) { directions.push("left"); }
                if (canMoveRight) { directions.push("right"); }
                if (canMoveUp && canMoveRight) { directions.push("up-right"); }
                if (canMoveUp && canMoveLeft) { directions.push("up-left"); }
                if (canMoveDown && canMoveRight) { directions.push("down-right"); }
                if (canMoveDown && canMoveLeft) { directions.push("down-left"); }

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
                    if (targetX > enemy.mapX && targetY > enemy.mapY) { enemy.movingDownRight = true; }
                    else if (targetX < enemy.mapX && targetY < enemy.mapY) { enemy.movingUpLeft = true; }
                    else if (targetX > enemy.mapX && targetY < enemy.mapY) { enemy.movingUpRight = true; }
                    else if (targetX < enemy.mapX && targetY > enemy.mapY) { enemy.movingDownLeft = true; }
                    else if (targetX === enemy.mapX && targetY > enemy.mapY) { enemy.movingDown = true; }
                    else if (targetX === enemy.mapX && targetY < enemy.mapY) { enemy.movingUp = true; }
                    else if (targetY === enemy.mapY && targetX > enemy.mapX) { enemy.movingRight = true; }
                    else if (targetY === enemy.mapY && targetX < enemy.mapX) { enemy.movingLeft = true; }
                }
            } else {
                // Wander randomly if no players nearby
                const spawn = ENEMY_SPAWNS[enemy.location];
                const topLeft = spawn.topLeft;
                const bottomRight = spawn.bottomRight;

                const canMoveUp = enemy.mapY - 1 >= topLeft[1];
                const canMoveDown = enemy.mapY + 1 <= bottomRight[1];
                const canMoveLeft = enemy.mapX - 1 >= topLeft[0];
                const canMoveRight = enemy.mapX + 1 <= bottomRight[0];

                const directions = [];

                if (canMoveUp) { directions.push("up"); }
                if (canMoveDown) { directions.push("down"); }
                if (canMoveLeft) { directions.push("left"); }
                if (canMoveRight) { directions.push("right"); }
                if (canMoveUp && canMoveRight) { directions.push("up-right"); }
                if (canMoveUp && canMoveLeft) { directions.push("up-left"); }
                if (canMoveDown && canMoveRight) { directions.push("down-right"); }
                if (canMoveDown && canMoveLeft) { directions.push("down-left"); }

                directions.push("none"); // Allow idle behavior sometimes

                const randomDir = directions[Math.floor(Math.random() * directions.length)];

                enemy.movingUp = false;
                enemy.movingDown = false;
                enemy.movingLeft = false;
                enemy.movingRight = false;
                enemy.movingUpRight = false;
                enemy.movingUpLeft = false;
                enemy.movingDownRight = false;
                enemy.movingDownLeft = false;

                if (randomDir === "up") { enemy.movingUp = true; }
                else if (randomDir === "down") { enemy.movingDown = true; }
                else if (randomDir === "left") { enemy.movingLeft = true; }
                else if (randomDir === "right") { enemy.movingRight = true; }
                else if (randomDir === "up-right") { enemy.movingUpRight = true; }
                else if (randomDir === "up-left") { enemy.movingUpLeft = true; }
                else if (randomDir === "down-right") { enemy.movingDownRight = true; }
                else if (randomDir === "down-left") { enemy.movingDownLeft = true; }
                // "none" means do nothing
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
                if (
                    checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length ||
                    !PASSABLE_TILES.includes(MAP[checkY][checkX])
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
                if (
                    checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length ||
                    !PASSABLE_TILES.includes(MAP[checkY][checkX])
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
            const spawn = ENEMY_SPAWNS[enemy.location];
            const topLeft = spawn.topLeft;
            const bottomRight = spawn.bottomRight;

            const minX = topLeft[0] * TILE_SIZE;
            const maxX = (bottomRight[0] + 1) * TILE_SIZE - 1;
            const minY = topLeft[1] * TILE_SIZE;
            const maxY = (bottomRight[1] + 1) * TILE_SIZE - 1;

            if (newPixelX < minX) { newPixelX = minX; }
            if (newPixelX > maxX) { newPixelX = maxX; }
            if (newPixelY < minY) { newPixelY = minY; }
            if (newPixelY > maxY) { newPixelY = maxY; }

            if (nearPLayer) {
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
                        health: enemy.health,
                        maxHealth: enemy.maxHealth,
                        name: enemy.name,
                        level: enemy.level
                    }, wss);
                }
            }
        }

        

        let deadDrops = []

    for (const dropID in drops) {
        const drop = drops[dropID]

        for (const playerID in players) {
            const player = players[playerID]
            const dx = Math.abs(player.pixelX - drop.pixelX);
            const dy = Math.abs(player.pixelY - drop.pixelY);
            if (dx < TILE_SIZE - 0.5 && dy < TILE_SIZE - 0.5) { //If picked up a drop
                if (player.health > 90) {
                    player.health = 100
                } else {
                    player.health += 10
                }

                // Update inventory in memory
                player.inventory[drop.name].itemAmount++;
                
                // Mark this item as needing database updat
                
                // Save immediately to database
                saveItem(drop.name, player.dbID, supabase);
                
                deadDrops.push(dropID)

                broadcast({
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
                    name: player.name,
                    inventory: player.inventory
                }, wss);
            }
        }
    }

        for (let i = 0; i < deadDrops.length; i++) {
            delete drops[deadDrops[i]]
        }
    }, 20);

    setInterval(() => { 
        for (const id in players) {
            const player = players[id];
            saveProgress(player, supabase);
            // Remove the saveItem loop - items are saved immediately when picked up
        }
    }, 5_000);
}
