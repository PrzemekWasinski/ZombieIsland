import { getNextDropID, getNextEnemyID } from "./state.js";

export function broadcast(data, wss) { //Send data to all clients
	const msg = JSON.stringify(data);
	for (const client of wss.clients) {
		client.send(msg);
	}
}

export async function updateStats(key, newValue, supabase) {
	// First, fetch the current value
	const { data: existing, error: fetchError } = await supabase
		.from("Statistics")
		.select("value")
		.eq("key", key)
		.single();

	if (fetchError || !existing) {
		console.log(`Failed to fetch current value for '${key}':`, fetchError?.message);
		return;
	}

	if (existing.value === newValue) {
		console.log(`${key} is already set to ${newValue}, no update needed`)
		return;
	}

	// Now update it
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

export function spawnEnemy(enemies, PASSABLE_TILES, MAP, enemyNextID, TILE_SIZE, topLeft, bottomRight, spawnLocation, enemyStats) {
	let x, y;
	x = Math.floor(Math.random() * (bottomRight[0] - topLeft[0] + 1) + topLeft[0]);
	y = Math.floor(Math.random() * (bottomRight[1] - topLeft[1] + 1) + topLeft[1]);


	if (PASSABLE_TILES.includes(MAP[y][x])) {
		enemies[enemyNextID] = { //Create new enemies
			id: enemyNextID,
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
			speed: enemyStats.speed
		};

		enemyNextID = getNextEnemyID();
	}
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
	const dx = coord1[0] - coord2[0]; // X-axis difference
	const dy = coord1[1] - coord2[1]; // Y-axis difference
	return dx * dx + dy * dy <= 1250; // 25^2 = 1250
}

export function spawnDrop(x, y, id, drops, TILE_SIZE) {
	drops[id] = {
		id: id,
		mapX: x,
		mapY: y,
		pixelX: x * TILE_SIZE,
		pixelY: y * TILE_SIZE
	}
}