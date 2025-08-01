import { WebSocketServer } from "ws";
import http from "http";
import { createClient } from "@supabase/supabase-js";
import { broadcast, updateStats, getMap, deleteItem } from "../game/functions.js";
import { players, enemies, getNextId, objects } from "../game/state.js";
import { startGame } from "../game/game.js";

export async function startWebSocket(config, url, apiKey) {
	const { MOVE_SPEED, TILE_SIZE, VISIBLE_TILES_X, VISIBLE_TILES_Y, PASSABLE_TILES, PLAYER_SPAWN, ENEMY_SPAWNS, OBJECT_SPAWNS, MAP } = config;

	const server = http.createServer();
	const wss = new WebSocketServer({ server });

	const supabase = createClient(url, apiKey);

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

				//Set playerId on the WebSocket client for game loop lookup
				ws.playerId = id;

				// Create and store the player object
				let inventory = {};
				const { data: inv, invError } = await supabase
					.from("InventoryItems")
					.select("*")
					.eq("playerID", ws.userId);

				if (!invError) {
					for (let i = 0; i < inv.length; i++) {
						inventory[inv[i].itemName] = { 
							itemName: inv[i].itemName, 
							itemAmount: inv[i].itemAmount 
						}
					}
				}

				players[id] = {
					id,
					dbID: ws.userId,
					mapX: characterData.mapX,
					mapY: characterData.mapY,
					pixelX: (characterData.mapX * TILE_SIZE) + (Math.floor(TILE_SIZE / 2)), //Centers the player on their tile position
					pixelY: (characterData.mapY * TILE_SIZE) + (Math.floor(TILE_SIZE / 2)),
					targetX: (characterData.mapX * TILE_SIZE) + (Math.floor(TILE_SIZE / 2)),
					targetY: (characterData.mapY * TILE_SIZE) + (Math.floor(TILE_SIZE / 2)),
					health: characterData.health,
					map: getMap(characterData.mapY, characterData.mapX, MAP, VISIBLE_TILES_X, VISIBLE_TILES_Y),
					movingUp: false,
					movingDown: false,
					movingLeft: false,
					movingRight: false,
					speed: MOVE_SPEED,
					lastMapX: characterData.mapX,
					lastMapY: characterData.mapY,
					username: characterData.username,
					level: characterData.level,
					gold: characterData.gold,
					inBoat: characterData.inBoat,
					messages: [],
					inventory: inventory
				};

				console.log(players[id].inventory)

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

					for (const enemyID in enemies) {
						const enemy = enemies[enemyID];
						const dx = Math.abs(player.pixelX - enemy.pixelX);
						const dy = Math.abs(player.pixelY - enemy.pixelY);

						if (dx < TILE_SIZE * 1.2 && dy < TILE_SIZE * 1.2) { // If enemy in range
							enemy.health = Math.max(0, enemy.health - 3); // Damage enemy (3 is the default value change this for when players deal theirown damage)

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

							break; //Allows the user to only attack 1 enemy at a time
						}
					}

					for (const objectID in objects) {
						const object = objects[objectID];
						const dx = Math.abs(player.pixelX - object.pixelX);
						const dy = Math.abs(player.pixelY - object.pixelY);

						if (dx < TILE_SIZE * 1.2 && dy < TILE_SIZE * 1.2) { // If object in range
							object.health = Math.max(0, object.health - 3); // Damage object (3 is the default value change this for when players deal theirown damage)

							broadcast({
								type: "object",
								id: object.id,
								mapX: object.mapX,
								mapY: object.mapY,
								pixelX: object.pixelX,
								pixelY: object.pixelY,
								health: object.health,
								maxHealth: object.maxHealth,
								name: object.name,
								level: object.level
							}, wss);

							break; //Allows the user to only damage 1 object at a time
						}
					}
				} else if (data.dir === "interact" && data.pressed) {
					if (MAP[player.mapY - 1][player.mapX] == 31 && !player.inBoat) {
						player.mapY -= 1;
						player.pixelY -= TILE_SIZE;
						player.targetY -= TILE_SIZE;
						player.inBoat = true;
					} else if (MAP[player.mapY + 1][player.mapX] == 31 && !player.inBoat) {
						player.mapY += 1;
						player.pixelY += TILE_SIZE; // was pixelX before! wrong
						player.targetY += TILE_SIZE;
						player.inBoat = true;

					} else if (MAP[player.mapY][player.mapX + 1] == 31 && !player.inBoat) {
						player.mapX += 1;
						player.pixelX += TILE_SIZE; // was pixelY before! wrong
						player.targetX += TILE_SIZE;
						player.inBoat = true;

					} else if (MAP[player.mapY][player.mapX - 1] == 31 && !player.inBoat) {
						player.mapX -= 1;
						player.pixelX -= TILE_SIZE;
						player.targetX -= TILE_SIZE;
						player.inBoat = true;
					}

					else if (PASSABLE_TILES.includes(MAP[player.mapY - 1][player.mapX]) && player.inBoat) {
						player.mapY -= 1;
						player.pixelY -= TILE_SIZE;
						player.targetY -= TILE_SIZE;
						player.inBoat = false;
					} else if (PASSABLE_TILES.includes(MAP[player.mapY + 1][player.mapX]) && player.inBoat) {
						player.mapY += 1;
						player.pixelY += TILE_SIZE;
						player.targetY += TILE_SIZE;
						player.inBoat = false;
					} else if (PASSABLE_TILES.includes(MAP[player.mapY][player.mapX + 1]) && player.inBoat) {
						player.mapX += 1;
						player.pixelX += TILE_SIZE;
						player.targetX += TILE_SIZE;
						player.inBoat = false;
					} else if (PASSABLE_TILES.includes(MAP[player.mapY][player.mapX - 1]) && player.inBoat) {
						player.mapX -= 1;
						player.pixelX -= TILE_SIZE;
						player.targetX -= TILE_SIZE;
						player.inBoat = false;
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
						inventory: player.inventory
					}, wss);
				} else if (data.dir === "message" && data.pressed) {
					for (const id in players) {
						let player = players[id]
						if (player.dbID == data.playerID) {
							player.messages.push({ text: data.message, timestamp: Date.now() })
						}
					}
				} else if (data.dir === "deleteItem") {
					for (const id in players) {
						const player = players[id];

						if (player.dbID === data.playerID) {
							player.inventory[data.item].itemAmount -= 1;
							deleteItem(player.inventory[data.item].itemName, player.dbID, supabase)
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

	startGame(wss, TILE_SIZE, VISIBLE_TILES_X, VISIBLE_TILES_Y, PASSABLE_TILES, PLAYER_SPAWN, ENEMY_SPAWNS, OBJECT_SPAWNS, MAP, supabase);
}