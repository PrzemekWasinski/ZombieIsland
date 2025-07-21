import { getNextDropID, getNextEnemyID } from "./state.js";

export function broadcast(data, wss) { //Send data to all clients
	const msg = JSON.stringify(data);
	for (const client of wss.clients) {
		client.send(msg);
	}
}

export async function saveProgress(player, supabase) {
	const { error } = await supabase
		.from("Characters")
		.update({
			"level": player.level,
			"gold": player.gold,
			"health": Math.floor(player.health),
			"mapX": player.mapX,
			"mapY": player.mapY,
			"inBoat": player.inBoat
		})
		.eq("id", player.dbID)
		.select();

	if (error) {
		console.log(`Failed to update stats for: ${player.name}`)
	}
}

export async function saveItem(drop, playerID, supabase) {
  const { data: dropData, error: fetchError } = await supabase
    .from("InventoryItems")
    .select("*")
    .eq("playerID", playerID)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows
    console.log(`Failed to fetch item: ${drop.name}`, fetchError);
    return false;
  }

  if (dropData) {
    if (dropData.itemAmount >= 99) {
      return false;
    } else {
      const { error: updateError } = await supabase
        .from("InventoryItems")
        .update({
          "itemAmount": dropData.itemAmount + 1,
          "itemName": drop.name, // update name if needed
        })
        .eq("playerID", playerID);

      if (updateError) {
        console.log(`Failed to update item: ${drop.name}`, updateError);
        return false;
      }
    }
  } else {
    const { error: insertError } = await supabase
      .from("InventoryItems")
      .insert({
        "playerID": playerID,
        "itemName": drop.name,
        "itemAmount": 1,
      });

    if (insertError) {
      console.log(`Failed to insert item: ${drop.name}`, insertError);
      return false;
    }
  }

  return true;
}

export async function updateStats(key, newValue, supabase) {
	const { data, error } = await supabase
		.from("Statistics")
		.update({ value: newValue })
		.eq("key", key)
		.select(); // Optional: get updated row back

	if (error) {
		console.log(`Failed to update metric '${key}':`, error.message);
	} else {
		console.log(`Metric '${key}' updated to:`, data[0]?.value);
	}
}

export function spawnEnemy(enemies, PASSABLE_TILES, MAP, enemyID, TILE_SIZE, topLeft, bottomRight, spawnLocation, enemyStats) {
	const x = Math.floor(Math.random() * (bottomRight[0] - topLeft[0] + 1)) + topLeft[0];
	const y = Math.floor(Math.random() * (bottomRight[1] - topLeft[1] + 1)) + topLeft[1];

	if (!PASSABLE_TILES.includes(MAP[y][x])) {
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

export function spawnObject(objects, PASSABLE_TILES, MAP, objectID, TILE_SIZE, topLeft, bottomRight, spawnLocation, objectStats) {
	const x = Math.floor(Math.random() * (bottomRight[0] - topLeft[0] + 1)) + topLeft[0];
	const y = Math.floor(Math.random() * (bottomRight[1] - topLeft[1] + 1)) + topLeft[1];

	if (!PASSABLE_TILES.includes(MAP[y][x])) {
		return null; // Invalid tile, cancel spawn
	}

	objects[objectID] = {
		id: objectID,
		mapX: x,
		mapY: y,
		pixelX: x * TILE_SIZE,
		pixelY: y * TILE_SIZE,
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

export function spawnDrop(x, y, id, drops, TILE_SIZE) {
	drops[id] = {
		id: id,
		name: "drop",
		mapX: Math.floor(x / TILE_SIZE),
		mapY: Math.floor(y / TILE_SIZE),
		pixelX: x,
		pixelY: y
	}
}