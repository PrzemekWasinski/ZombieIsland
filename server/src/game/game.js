import { players, enemies, enemyNextID } from "./state.js";
import { broadcast, spawnEnemy, getMap, isNearby } from "../game/functions.js";

export function startGame(wss, TILE_SIZE, VISIBLE_TILES_X, VISIBLE_TILES_Y, PASSABLE_TILES, PLAYER_SPAWN, ENEMY_SPAWNS, MAP) {
    let locationData = {}
    for (let i = 0; i < Object.keys(ENEMY_SPAWNS).length; i++) {
        locationData[Object.keys(ENEMY_SPAWNS)[i]] = 0
    }

    for (let i = 0; i < Object.keys(ENEMY_SPAWNS).length; i++) {
        let key = Object.keys(ENEMY_SPAWNS)[i]
        let spawnData = ENEMY_SPAWNS[key]
        for (let j = 0; j < spawnData.enemyAmount; j++) {
            spawnEnemy(enemies, PASSABLE_TILES, MAP, enemyNextID, TILE_SIZE, spawnData.topLeft, spawnData.bottomRight, key)
        }
    }

    setInterval(() => { //Game loop 50 times per second
        const deadEnemies = Object.keys(enemies).filter(id => enemies[id].health <= 0);
        for (const id of deadEnemies) {
            const loc = enemies[id].location;
            locationData[loc]--;
            delete enemies[id];
        }

        for (let i = 0; i < Object.keys(ENEMY_SPAWNS).length; i++) {
            let key = Object.keys(ENEMY_SPAWNS)[i];
            let spawnData = ENEMY_SPAWNS[key];

            while (locationData[key] < spawnData.enemyAmount) {
                spawnEnemy(enemies, PASSABLE_TILES, MAP, enemyNextID, TILE_SIZE, spawnData.topLeft, spawnData.bottomRight, key);
                locationData[key]++;
            }
        }

        for (const id in players) { //Update all players
            const player = players[id];

            if (Math.floor(player.health) < 1) { //Respawn dead players
                player.mapX = PLAYER_SPAWN[0]
                player.mapY = PLAYER_SPAWN[1]
                player.pixelX = PLAYER_SPAWN[0] * TILE_SIZE
                player.pixelY = PLAYER_SPAWN[1] * TILE_SIZE
                player.targetX = PLAYER_SPAWN[0] * TILE_SIZE
                player.targetY = PLAYER_SPAWN[1] * TILE_SIZE
                player.health = 100
            } else {
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
                }

                let sendMap = false;
                if (player.mapX !== player.lastMapX || player.mapY !== player.lastMapY) { //Tile changed
                    player.map = getMap(player.mapY, player.mapX, MAP, VISIBLE_TILES_X, VISIBLE_TILES_Y);
                    player.lastMapX = player.mapX;
                    player.lastMapY = player.mapY;
                    sendMap = true;
                }

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
                        health: player.health,
                        map: sendMap ?
                            player.map : undefined,
                        username: player.username,
                        level: player.level,
                        gold: player.gold
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
                    gold: player.gold
                }, wss, ws_client);
            }

            for (const enemyID in enemies) { //Check enemy collisions
                const enemy = enemies[enemyID];
                const dx = Math.abs(player.pixelX - enemy.pixelX);
                const dy = Math.abs(player.pixelY - enemy.pixelY);
                if (dx < TILE_SIZE * 0.8 && dy < TILE_SIZE * 0.8) { //If too close to enemy
                    player.health = Math.max(0, player.health - 0.25); //Take damage
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
                        gold: player.gold,
                        level: player.level
                    }, wss);
                }
            }
        }

        for (const enemyID in enemies) { //Update all enemies
            const enemy = enemies[enemyID];
            let nearPLayer = false

            for (const playerID in players) {
                const player = players[playerID]
                if (isNearby([enemy.mapX, enemy.mapY], [player.mapX, player.mapY])) {
                    nearPLayer = true
                    break;
                }
            }

            if (Math.random() < 0.01 && nearPLayer) {
                const spawn = ENEMY_SPAWNS[enemy.location];
                const topLeft = spawn.topLeft;
                const bottomRight = spawn.bottomRight;

                const canMoveUp = enemy.mapY - 1 >= topLeft[1];
                const canMoveDown = enemy.mapY + 1 <= bottomRight[1];
                const canMoveLeft = enemy.mapX - 1 >= topLeft[0];
                const canMoveRight = enemy.mapX + 1 <= bottomRight[0];

                // Only include valid directions
                const directions = [];

                if (canMoveUp) directions.push("up");
                if (canMoveDown) directions.push("down");
                if (canMoveLeft) directions.push("left");
                if (canMoveRight) directions.push("right");
                if (canMoveUp && canMoveRight) directions.push("up-right");
                if (canMoveUp && canMoveLeft) directions.push("up-left");
                if (canMoveDown && canMoveRight) directions.push("down-right");
                if (canMoveDown && canMoveLeft) directions.push("down-left");
                directions.push("none"); // Optional: allow standing still

                const randomDir = directions[Math.floor(Math.random() * directions.length)];

                enemy.movingUp = false;
                enemy.movingDown = false;
                enemy.movingLeft = false;
                enemy.movingRight = false;
                enemy.movingUpRight = false;
                enemy.movingUpLeft = false;
                enemy.movingDownRight = false;
                enemy.movingDownleft = false;

                if (randomDir === "up") enemy.movingUp = true;
                else if (randomDir === "down") enemy.movingDown = true;
                else if (randomDir === "left") enemy.movingLeft = true;
                else if (randomDir === "right") enemy.movingRight = true;
                else if (randomDir === "up-right") enemy.movingUpRight = true;
                else if (randomDir === "up-left") enemy.movingUpLeft = true;
                else if (randomDir === "down-right") enemy.movingDownRight = true;
                else if (randomDir === "down-left") enemy.movingDownleft = true;
            }

            let velocityX = 0;
            let velocityY = 0;
            if (enemy.movingUp || enemy.movingUpLeft || enemy.movingUpRight) velocityY = -1.5;
            else if (enemy.movingDown || enemy.movingDownRight || enemy.movingDownleft) velocityY = 1.5;
            if (enemy.movingLeft || enemy.movingDownleft || enemy.movingUpRight) velocityX = -1.5;
            else if (enemy.movingRight || enemy.movingDownRight || enemy.movingUpRight) velocityX = 1.5;

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
                    enemy.movingUpLeft = false;
                    enemy.movingUpRight = false;
                    enemy.movingDownRight = false;
                    enemy.movingDownleft = false;
                }
            }

            if (newTileY !== currentTileY) { //Check vertical collision
                const checkX = currentTileX;
                const checkY = newTileY;
                if (checkY < 0 || checkY >= MAP.length || checkX < 0 || checkX >= MAP[0].length || !PASSABLE_TILES.includes(MAP[checkY][checkX])) {
                    newPixelY = velocityY > 0 ? currentTileY * TILE_SIZE + TILE_SIZE - 1 : currentTileY * TILE_SIZE;
                    enemy.movingUp = false;
                    enemy.movingDown = false;
                    enemy.movingUpLeft = false;
                    enemy.movingUpRight = false;
                    enemy.movingDownRight = false;
                    enemy.movingDownleft = false;
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
                    enemy.movingUpLeft = false;
                    enemy.movingUpRight = false;
                    enemy.movingDownRight = false;
                    enemy.movingDownleft = false;
                }
            }
            const spawn = ENEMY_SPAWNS[enemy.location];
            const topLeft = spawn.topLeft;
            const bottomRight = spawn.bottomRight;

            const minX = topLeft[0] * TILE_SIZE;
            const maxX = (bottomRight[0] + 1) * TILE_SIZE - 1;
            const minY = topLeft[1] * TILE_SIZE;
            const maxY = (bottomRight[1] + 1) * TILE_SIZE - 1;

            if (newPixelX < minX) newPixelX = minX;
            if (newPixelX > maxX) newPixelX = maxX;
            if (newPixelY < minY) newPixelY = minY;
            if (newPixelY > maxY) newPixelY = maxY;

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
                        health: enemy.health
                    }, wss);
                }
            }
        }
    }, 20);
}