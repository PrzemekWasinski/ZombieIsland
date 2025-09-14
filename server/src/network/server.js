import { WebSocketServer } from "ws";
import http from "http";
import { createClient } from "@supabase/supabase-js";
import { broadcast, updateStats, getMap, deleteItem, broadcastToNearby } from "../game/functions.js";
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
			try {
				const data = JSON.parse(message);

				//Handle user authentication
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

					//Assign a new in game player ID
					let id = getNextId()
					playerId = id;

					//Set playerId on the websocket client for game loop lookup
					ws.playerId = id;

					//Create and store the player object
					let inventory = {};
					const { data: inv, invError } = await supabase
						.from("InventoryItems")
						.select("*")
						.eq("playerID", ws.userId);

					if (!invError && inv) {
						for (let i = 0; i < inv.length; i++) {
							inventory[inv[i].itemName] = {
								itemName: inv[i].itemName,
								itemAmount: inv[i].itemAmount
							}
						}
					}

					players[id] = {
						id,
						ws, //Attach websocket connection
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
						inventory: inventory,
						healthChanged: false 
					};

					console.log(`Player ${id} connected and authenticated.`);
					await updateStats("active_players", Object.keys(players).length, supabase);

					//Send only essential data
					ws.send(JSON.stringify({
						type: "init",
						id,
						player: players[id] //Send only this player's data
					}));

					//Send existing players to new player
					for (const existingId in players) {
						if (existingId !== id.toString()) {
							ws.send(JSON.stringify({
								type: "join",
								player: players[existingId]
							}));
						}
					}

					//Broadcast new player to existing players only
					broadcast({
						type: "join",
						player: players[id]
					}, wss, ws); //Exclude the new player from broadcast

					return;
				}

				//Handle key input
				if (data.type === "keydown") {
					//Check if player is authenticated first
					if (playerId === null) {
						return;
					}

					const player = players[playerId];
					if (!player) {
						return;
					}

					//Handle movement keys
					if (data.dir === "up") { 
						player.movingUp = data.pressed; 
					}
					else if (data.dir === "down") { 
						player.movingDown = data.pressed; 
					}
					else if (data.dir === "left") { 
						player.movingLeft = data.pressed; 
					}
					else if (data.dir === "right") { 
						player.movingRight = data.pressed; 
					}
					else if (data.dir === "attack" && data.pressed) { 
						let attackHit = false;

						for (const enemyID in enemies) {
							if (attackHit) break; // Only attack one target

							const enemy = enemies[enemyID];
							const dx = Math.abs(player.pixelX - enemy.pixelX);
							const dy = Math.abs(player.pixelY - enemy.pixelY);

							if (dx < TILE_SIZE * 1.2 && dy < TILE_SIZE * 1.2) {
								const oldHealth = enemy.health;
								enemy.health = Math.max(0, enemy.health - 3);
								
								//Only broadcast if health actually changed
								if (enemy.health !== oldHealth) {
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
										action: "hurt"
									}, wss, players);
								}
								attackHit = true;
							}
						}

						//Attack objects if no enemy was hit
						if (!attackHit) {
							for (const objectID in objects) {
								const object = objects[objectID];
								const dx = Math.abs(player.pixelX - object.pixelX);
								const dy = Math.abs(player.pixelY - object.pixelY);

								if (dx < TILE_SIZE * 1.2 && dy < TILE_SIZE * 1.2) {
									const oldHealth = object.health;
									object.health = Math.max(0, object.health - 3);
									
									//Only broadcast if health actually changed
									if (object.health !== oldHealth) {
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
											level: object.level
										}, wss, players);
									}
									break;
								}
							}
						}
					} 
					else if (data.dir === "interact" && data.pressed) {
						let boatStateChanged = false;
						const oldInBoat = player.inBoat;

						//Check bounds before accessing MAP
						const mapHeight = MAP.length;
						const mapWidth = MAP[0].length;

						//Get into boat logic
						if (!player.inBoat) {
							if (player.mapY > 0 && MAP[player.mapY - 1][player.mapX] === 31) {
								player.mapY -= 1;
								player.pixelY -= TILE_SIZE;
								player.targetY -= TILE_SIZE;
								player.inBoat = true;
								boatStateChanged = true;
							} else if (player.mapY < mapHeight - 1 && MAP[player.mapY + 1][player.mapX] === 31) {
								player.mapY += 1;
								player.pixelY += TILE_SIZE;
								player.targetY += TILE_SIZE;
								player.inBoat = true;
								boatStateChanged = true;
							} else if (player.mapX < mapWidth - 1 && MAP[player.mapY][player.mapX + 1] === 31) {
								player.mapX += 1;
								player.pixelX += TILE_SIZE;
								player.targetX += TILE_SIZE;
								player.inBoat = true;
								boatStateChanged = true;
							} else if (player.mapX > 0 && MAP[player.mapY][player.mapX - 1] === 31) {
								player.mapX -= 1;
								player.pixelX -= TILE_SIZE;
								player.targetX -= TILE_SIZE;
								player.inBoat = true;
								boatStateChanged = true;
							}
						}
						//Get out of boat logic
						else {
							if (player.mapY > 0 && PASSABLE_TILES.includes(MAP[player.mapY - 1][player.mapX])) {
								player.mapY -= 1;
								player.pixelY -= TILE_SIZE;
								player.targetY -= TILE_SIZE;
								player.inBoat = false;
								boatStateChanged = true;
							} else if (player.mapY < mapHeight - 1 && PASSABLE_TILES.includes(MAP[player.mapY + 1][player.mapX])) {
								player.mapY += 1;
								player.pixelY += TILE_SIZE;
								player.targetY += TILE_SIZE;
								player.inBoat = false;
								boatStateChanged = true;
							} else if (player.mapX < mapWidth - 1 && PASSABLE_TILES.includes(MAP[player.mapY][player.mapX + 1])) {
								player.mapX += 1;
								player.pixelX += TILE_SIZE;
								player.targetX += TILE_SIZE;
								player.inBoat = false;
								boatStateChanged = true;
							} else if (player.mapX > 0 && PASSABLE_TILES.includes(MAP[player.mapY][player.mapX - 1])) {
								player.mapX -= 1;
								player.pixelX -= TILE_SIZE;
								player.targetX -= TILE_SIZE;
								player.inBoat = false;
								boatStateChanged = true;
							}
						}

						//Only broadcast if boat state actually changed
						if (boatStateChanged) {
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
								inBoat: player.inBoat,
								inventory: player.inventory
							}, wss);
						}
					} 
					else if (data.dir === "message" && data.pressed) {
						const targetPlayer = players[playerId];
						if (targetPlayer && targetPlayer.dbID === data.playerID) {
							targetPlayer.messages.push({ 
								text: data.message, 
								timestamp: Date.now() 
							});
						}
					} 
					else if (data.dir === "deleteItem") {
						const targetPlayer = players[playerId];
						if (targetPlayer && targetPlayer.dbID === data.playerID && targetPlayer.inventory[data.item]) {
							const itemName = targetPlayer.inventory[data.item].itemName;

							try {
								const success = await deleteItem(itemName, targetPlayer.dbID, supabase, targetPlayer, data.item);
								if (!success) {
									console.log("Failed to delete item in DB");
								}
							} catch (err) {
								console.error("Failed to delete item:", err);
							}
						}
					}
				}
			} catch (error) {
				console.error("Error processing message:", error);
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

		//Handle WebSocket errors
		ws.on("error", (error) => {
			console.error("WebSocket error:", error);
		});
	});

	startGame(wss, TILE_SIZE, VISIBLE_TILES_X, VISIBLE_TILES_Y, PASSABLE_TILES, PLAYER_SPAWN, ENEMY_SPAWNS, OBJECT_SPAWNS, MAP, supabase);
}