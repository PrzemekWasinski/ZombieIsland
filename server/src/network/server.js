import { WebSocketServer } from "ws";
import http from "http";
import { createClient } from "@supabase/supabase-js";
import { broadcast, updateStats, getMap } from "../game/functions.js";
import { players, enemies, getNextId } from "../game/state.js";
import { startGame } from "../game/game.js";

export async function startWebSocket(config) {
	const { URL, API_KEY, MOVE_SPEED, TILE_SIZE, VISIBLE_TILES_X, VISIBLE_TILES_Y, PASSABLE_TILES, PLAYER_SPAWN, ENEMY_SPAWNS, MAP } = config;

	const server = http.createServer();
	const wss = new WebSocketServer({ server });

	const supabase = createClient(URL, API_KEY);

	await updateStats("active_players", 0, supabase); //Set active players to 0

	server.listen(8080, () => {
		console.log("WebSocket server running");
	});

	wss.on("connection", (ws) => {
		let playerId = null;

		ws.on("message", async (message) => {
			const data = JSON.parse(message);

			// Handle user authentication
			if (data.type === "auth") {

				const { data: userData, error } = await supabase.auth.getUser(data.token);

				if (error || !userData?.user) {
					console.error("Authentication failed:", error?.message);
					return ws.close();
				}

				ws.userId = userData.user.id;

				// Now try your original query
				const { data: characterData, error: fetchError } = await supabase
					.from("Characters")
					.select("*")
					.eq("id", ws.userId)
					.single();

				if (fetchError || !characterData) {
					console.error("Failed to retrieve player data:", fetchError?.message);
					return;
				}

				// Assign a new in-game player ID
				let id = getNextId()
				playerId = id;

				// IMPORTANT: Set playerId on the WebSocket client for game loop lookup
				ws.playerId = id;

				// Create and store the player object
				players[id] = {
					id,
					mapX: PLAYER_SPAWN[0],
					mapY: PLAYER_SPAWN[1],
					pixelX: PLAYER_SPAWN[0] * TILE_SIZE,
					pixelY: PLAYER_SPAWN[1] * TILE_SIZE,
					targetX: PLAYER_SPAWN[0] * TILE_SIZE,
					targetY: PLAYER_SPAWN[1] * TILE_SIZE,
					health: 100,
					map: getMap(PLAYER_SPAWN[1], PLAYER_SPAWN[0], MAP, VISIBLE_TILES_X, VISIBLE_TILES_Y),
					movingUp: false,
					movingDown: false,
					movingLeft: false,
					movingRight: false,
					speed: MOVE_SPEED,
					lastMapX: PLAYER_SPAWN[0],
					lastMapY: PLAYER_SPAWN[1],
					username: characterData.username,
					level: characterData.level,
					gold: characterData.gold
				};

				console.log(`Player ${id} connected and authenticated.`);
				await updateStats("active_players", Object.keys(players).length, supabase);

				ws.send(JSON.stringify({
					type: "init",
					id,
					players
				}));

				broadcast({
					type: "join",
					player: players[id]
				}, wss);

				return;
			}

			// Handle key input (movement and attack)
			if (data.type === "keydown") {
				// Check if player is authenticated first
				if (playerId === null) {
					console.log("Player not authenticated yet");
					return;
				}

				const player = players[playerId]; // Use playerId instead of id
				if (!player) {
					console.log("Player not found:", playerId);
					return;
				}

				if (data.dir === "up") { player.movingUp = data.pressed; }
				else if (data.dir === "down") { player.movingDown = data.pressed; }
				else if (data.dir === "left") { player.movingLeft = data.pressed; }
				else if (data.dir === "right") { player.movingRight = data.pressed; }
				else if (data.dir === "attack") { // Fixed: was msg.dir
					let hasUpdated = false;
					for (const enemyID in enemies) {
						const enemy = enemies[enemyID];
						const dx = Math.abs(player.pixelX - enemy.pixelX);
						const dy = Math.abs(player.pixelY - enemy.pixelY);
						if (dx < TILE_SIZE * 1.2 && dy < TILE_SIZE * 1.2) { // If enemy in range
							enemy.health = Math.max(0, enemy.health - 3); // Damage enemy (3 is the default value change this for when players deal theirown damage)
							hasUpdated = true;
						}
						if (hasUpdated) {
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
								maxHealth: enemy.maxHealth
							}, wss);
						}
					}
				}
			}
		});

		ws.on("close", async () => {
			if (playerId !== null) {
				console.log(`Player ${playerId} disconnected.`);
				delete players[playerId];
				await updateStats("active_players", Object.keys(players).length, supabase);

				broadcast({
					type: "leave",
					id: playerId
				}, wss);
			}
		});
	});

	startGame(wss, TILE_SIZE, VISIBLE_TILES_X, VISIBLE_TILES_Y, PASSABLE_TILES, PLAYER_SPAWN, ENEMY_SPAWNS, MAP);
}