import { getNextDropID, getNextEnemyID } from "./state.js";
import { getItemValue } from "../config/items.js";

export function broadcast(data, wss, exclude) { //Send data to all clients
	const msg = JSON.stringify(data);
	for (const client of wss.clients) {
		if (client !== exclude && client.readyState === 1 /* WebSocket.OPEN */) {
			client.send(msg);
		}
	}
}

export function broadcastToNearby(entity, data, wss, players, exclude) {
	const msg = JSON.stringify(data);
	const entityPos = [entity.mapX, entity.mapY];

	for (const client of wss.clients) {
		if (client === exclude || client.readyState !== 1 /* WebSocket.OPEN */) continue;

		const player = players[client.playerId];
		if (player && isNearby(entityPos, [player.mapX, player.mapY])) {
			client.send(msg);
		}
	}
}

export async function saveProgress(player, supabase) {
	const { error } = await supabase
		.from("Characters")
		.update({
			level: player.level,
			gold: player.gold,
			health: Math.floor(player.health),
			mapX: player.mapX,
			mapY: player.mapY,
			inBoat: player.inBoat,
			maxHealth: player.maxHealth,
			damage: player.damage,
			speed: player.speed
		})
		.eq("id", player.dbID)
		.select();

	if (error) {
		console.log(`Failed to update stats for: ${player.username}: ${error.message}`);
	}
}
    
export async function saveItem(dropName, playerID, supabase) {
	const key = `${playerID}-${dropName}`;
	try {
		// Fetch all matching items (handles duplicate entries)
		const { data: dropDataArray, error: fetchError } = await supabase
			.from("InventoryItems")
			.select("*")
			.eq("playerID", playerID)
			.eq("itemName", dropName);

		if (fetchError) {
			console.log(`Failed to fetch item: ${dropName}`, fetchError);
			return false;
		}

		// If items exist (even duplicates)
		if (dropDataArray && dropDataArray.length > 0) {
			const dropData = dropDataArray[0]; // Use first item

			if (dropData.itemAmount >= 999) {
				return false;
			} else {
				// Update ALL matching items to keep them in sync
				const { error: updateError } = await supabase
					.from("InventoryItems")
					.update({
						"itemAmount": dropData.itemAmount + 1,
						"itemName": dropName
					})
					.eq("playerID", playerID)
					.eq("itemName", dropName);

				if (updateError) {
					console.log(`Failed to update item: ${dropName}`, updateError);
					return false;
				}
			}
		} else {
			// No items found, insert a new one
			const { error: insertError } = await supabase
				.from("InventoryItems")
				.insert({
					"playerID": playerID,
					"itemName": dropName,
					"itemAmount": 1
				});

			if (insertError) {
				console.log(`Failed to insert item: ${dropName}`, insertError);
				return false;
			}
		}

		return true;
	} catch (error) {
		console.log(`Error saving item ${dropName}:`, error);
		return false;
	}
}

export async function deleteItem(dropName, playerID, supabase, player, item) {
  try {
    // Fetch all matching items (handles duplicate entries)
    const { data: items, error: fetchError } = await supabase
      .from("InventoryItems")
      .select("itemAmount")
      .eq("playerID", playerID)
      .eq("itemName", dropName);

    if (fetchError || !items || items.length === 0) {
      console.error(`Item not found: ${dropName}`, fetchError);
      return false;
    }

    // Use the first item if there are duplicates
    const firstItem = items[0];

    if (firstItem.itemAmount <= 0) {
      console.log(`No ${dropName} left to delete`);
      return false;
    }

    // Update ALL matching items to prevent inconsistency
    const { data, error } = await supabase
      .from("InventoryItems")
      .update({ itemAmount: firstItem.itemAmount - 1 })
      .eq("playerID", playerID)
      .eq("itemName", dropName)
      .select("itemAmount");

    player.inventory[item].itemAmount = firstItem.itemAmount - 1;

    if (error) {
      console.error(`Failed to update item: ${dropName}`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting item ${dropName}:`, error);
    return false;
  }
}

export async function updateStats(key, newValue, supabase) {
	const { data, error } = await supabase
		.from("Statistics")
		.update({ value: newValue })
		.eq("key", key)
		.select(); 

	if (error) {
		console.log(`Failed to update metric '${key}':`, error.message);
	}
}

export function spawnEnemy(enemies, PASSABLE_TILES, MAP, enemyID, TILE_SIZE, biome, spawnLocation, enemyStats, biomes) {
	const x = Math.floor(Math.random() * 2500); // 0–2499
	const y = Math.floor(Math.random() * 1750); // 0–1749

	if (!biomes[biome].includes(MAP[y][x])) {
		return null; // Invalid tile, cancel spawn
	}

	enemies[enemyID] = {
		id: enemyID,
		mapX: x,
		mapY: y,
		pixelX: x * TILE_SIZE,
		pixelY: y * TILE_SIZE,
		targetX: x * TILE_SIZE,
		targetY: y * TILE_SIZE,
		movingX: 0,
		movingY: 0,
		health: enemyStats.health[0],
		maxHealth: enemyStats.health[1],
		location: spawnLocation,
		name: enemyStats.name,
		damage: enemyStats.damage,
		speed: enemyStats.speed,
		level: enemyStats.level
	};

	return enemyID;
}

// When player connects or changes significant area, send all nearby objects
export function sendNearbyObjects(player, objects, wss) {
    for (const objectID in objects) {
        const object = objects[objectID];

        if (isNearby([player.mapX, player.mapY], [object.mapX, object.mapY])) {
            if (player.ws && player.ws.readyState === 1) {
                player.ws.send(JSON.stringify({
                    type: "object",
                    id: object.id,
                    mapX: object.mapX,
                    mapY: object.mapY,
                    pixelX: object.pixelX,
                    pixelY: object.pixelY,
                    health: object.health,
                    maxHealth: object.maxHealth,
                    name: object.name,
                }));
            }
        }
    }
}

// When player connects or changes significant area, send all nearby drops
export function sendNearbyDrops(player, drops, wss) {
    for (const dropID in drops) {
        const drop = drops[dropID];

        if (isNearby([player.mapX, player.mapY], [drop.mapX, drop.mapY])) {
            if (player.ws && player.ws.readyState === 1) {
                player.ws.send(JSON.stringify({
                    type: "drop",
                    id: drop.id,
                    name: drop.name,
                    mapX: drop.mapX,
                    mapY: drop.mapY,
                    pixelX: drop.pixelX,
                    pixelY: drop.pixelY
                }));
            }
        }
    }
}

export function spawnObject(objects, PASSABLE_TILES, MAP, objectID, TILE_SIZE, biome, spawnLocation, objectStats, biomes) {
	const x = Math.floor(Math.random() * 2500); // 0–2499
	const y = Math.floor(Math.random() * 1750); // 0–1749

	// Check if current tile is in correct biome
	if (!biomes[biome].includes(MAP[y][x])) {
		return null; // Invalid tile, cancel spawn
	}

	// Check if current tile is only base passable tiles (1, 2, 3, or 4)
	if (!PASSABLE_TILES.includes(MAP[y][x])) {
		return null; // Object should only spawn on center tiles
	}

	// Check if all surrounding tiles (4 directions) are also passable
	const adjacentTiles = [
		{ x: x, y: y - 1 },  // Up
		{ x: x, y: y + 1 },  // Down
		{ x: x - 1, y: y },  // Left
		{ x: x + 1, y: y }   // Right
	];

	for (const tile of adjacentTiles) {
		// Check bounds
		if (tile.y < 0 || tile.y >= MAP.length || tile.x < 0 || tile.x >= MAP[0].length) {
			return null; // Out of bounds
		}

		// Check if adjacent tile is passable
		const adjacentTileValue = MAP[tile.y][tile.x];
		if (!PASSABLE_TILES.includes(adjacentTileValue) && !biomes[biome].includes(adjacentTileValue)) {
			return null; // Adjacent tile not passable
		}
	}

	objects[objectID] = {
		id: objectID,
		mapX: x,
		mapY: y,
		pixelX: (x * TILE_SIZE) + (Math.floor(TILE_SIZE / 2)),
		pixelY: (y * TILE_SIZE) + (Math.floor(TILE_SIZE / 2)),
		health: objectStats.health[0],
		maxHealth: objectStats.health[1],
		location: spawnLocation,
		name: objectStats.name,
	};

	return objectID;
}

export function getMap(mapY, mapX, MAP, VISIBLE_TILES_X, VISIBLE_TILES_Y) { //Get visible map area
	if (VISIBLE_TILES_X % 2 === 0) VISIBLE_TILES_X -= 1; //Make odd
	if (VISIBLE_TILES_Y % 2 === 0) VISIBLE_TILES_Y -= 1; //Make odd

	const halfY = Math.floor(VISIBLE_TILES_Y / 2); //Half visible Y
	const halfX = Math.floor(VISIBLE_TILES_X / 2); //Half visible X

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

export function isNearby(coord1, coord2) {
	const dx = Math.abs(coord1[0] - coord2[0]);
	const dy = Math.abs(coord1[1] - coord2[1]);
	return dx + dy <= 50;
}

export function spawnDrop(dropData, x, y, id, drops, TILE_SIZE, offsetX = 0, offsetY = 0) {
	// Apply offset to position the drop on adjacent tiles
	const finalX = x + (offsetX * TILE_SIZE);
	const finalY = y + (offsetY * TILE_SIZE);

	// Get value from items config, fallback to dropData for special items like Heart/Gold
	const itemValue = getItemValue(dropData.name) || dropData.value || dropData.health || dropData.amount;

	drops[id] = {
		id: id,
		name: dropData.name,
		mapX: Math.floor(finalX / TILE_SIZE),
		mapY: Math.floor(finalY / TILE_SIZE),
		pixelX: finalX,
		pixelY: finalY,
		value: itemValue
	}
}