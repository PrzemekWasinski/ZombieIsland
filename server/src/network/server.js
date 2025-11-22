import { WebSocketServer } from "ws";
import http from "http";
import { createClient } from "@supabase/supabase-js";
import { broadcast, updateStats, getMap, deleteItem, broadcastToNearby, sendNearbyObjects, sendNearbyDrops, saveProgress, spawnDrop, saveItem } from "../game/functions.js";
import { players, enemies, getNextId, objects, drops, getNextDropID } from "../game/state.js";
import { startGame } from "../game/game.js";
import { shops } from "../config/shop.js";
import { isConsumable, getHealthRestore } from "../config/items.js";

const getSerializablePlayer = (player) => {
	if (!player) {
		return null;
	}

	const { ws, ...serializablePlayer } = player;
	return serializablePlayer;
};

export async function startWebSocket(config, url, apiKey) {
	const { MOVE_SPEED, TILE_SIZE, VISIBLE_TILES_X, VISIBLE_TILES_Y, PASSABLE_TILES, PLAYER_SPAWN, ENEMY_SPAWNS, OBJECT_SPAWNS, MAP, biomes } = config;

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

					// Check if this user is already connected and disconnect the old session
					for (const existingPlayerId in players) {
						const existingPlayer = players[existingPlayerId];
						if (existingPlayer.dbID === ws.userId) {
							console.log(`User ${ws.userId} already connected. Disconnecting old session.`);

							// Broadcast leave message for the old session
							broadcast({
								type: "leave",
								id: existingPlayer.id
							}, wss);

							// Close the old websocket connection
							if (existingPlayer.ws && existingPlayer.ws.readyState === 1) {
								existingPlayer.ws.close();
							}

							// Remove the old player from memory
							delete players[existingPlayerId];
							await updateStats("active_players", Object.keys(players).length, supabase);
							break;
						}
					}

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
						maxHealth: characterData.maxHealth,
						damage: characterData.damage,
						map: getMap(characterData.mapY, characterData.mapX, MAP, VISIBLE_TILES_X, VISIBLE_TILES_Y),
						movingUp: false,
						movingDown: false,
						movingLeft: false,
						movingRight: false,
						speed: characterData.speed,
						lastMapX: characterData.mapX,
						lastMapY: characterData.mapY,
						username: characterData.username,
						level: characterData.level,
						gold: characterData.gold,
						inBoat: characterData.inBoat,
						messages: [],
						inventory: inventory,
						healthChanged: false,
						direction: "down",
						action: "idle",
						ready: true,
						lastAttackTime: 0,
						attackStartTime: null
					};

					const serializableNewPlayer = getSerializablePlayer(players[id]);

					console.log(`${characterData.username} connected and authenticated.`);
					await updateStats("active_players", Object.keys(players).length, supabase);

					//Send only essential data
					ws.send(JSON.stringify({
						type: "init",
						id,
						player: serializableNewPlayer //Send only this player's data
					}));

					sendNearbyObjects(players[id], objects, wss)
					sendNearbyDrops(players[id], drops, wss)

					//Send existing players to new player
					for (const existingId in players) {
						if (existingId !== id.toString()) {
							ws.send(JSON.stringify({
								type: "join",
								player: getSerializablePlayer(players[existingId])
							}));
						}
					}

					//Broadcast new player to existing players only
					broadcast({
						type: "join",
						player: serializableNewPlayer
					}, wss, ws); //Exclude the new player from broadcast

					// Broadcast join message to all players as a system message
					broadcast({
						type: "systemMessage",
						text: `${characterData.username} joined the game`,
						timestamp: Date.now(),
						color: "yellow"
					}, wss);

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
						// Check attack cooldown (500ms = 0.5 seconds)
						const currentTime = Date.now();
						const attackCooldown = 500;

						if (currentTime - player.lastAttackTime < attackCooldown) {
							return; // Still on cooldown, ignore this attack
						}

						player.lastAttackTime = currentTime;
						player.action = "attack"; // Set action to attack
						player.attackStartTime = currentTime; // Track when attack started

						// Broadcast attack to nearby players only (not to attacker - they control their own animation)
						const attackUpdate = {
							type: "update",
							id: player.id,
							username: player.username,
							mapX: player.mapX,
							mapY: player.mapY,
							pixelX: player.pixelX,
							pixelY: player.pixelY,
							action: player.action,
							direction: player.direction
						};

						broadcastToNearby(player, attackUpdate, wss, players);

						let attackHit = false;

						for (const enemyID in enemies) {
							if (attackHit) break; // Only attack one target

							const enemy = enemies[enemyID];
							const dx = Math.abs(player.pixelX - enemy.pixelX);
							const dy = Math.abs(player.pixelY - enemy.pixelY);

							if (dx < TILE_SIZE * 1.2 && dy < TILE_SIZE * 1.2) {
								const oldHealth = enemy.health;
								enemy.health = Math.max(0, enemy.health - player.damage);
								
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
										object.lastHitTime = Date.now(); // Track when object was hit for flash effect

										// Check for random drops when hitting object (not destroyed)
										if (object.health > 0 && OBJECT_SPAWNS[object.location]) {
											const possibleDrops = OBJECT_SPAWNS[object.location].objectStats.possibleDrops;

											// Check each possible drop
											for (let i = 0; i < possibleDrops.length; i++) {
												const dropData = possibleDrops[i];
												const rand = Math.floor(Math.random() * 100) + 1; // 1-100

												// If random number is less than chance, spawn the drop
												if (rand < dropData.chance) {
													// Choose random adjacent tile (up, down, left, right)
													const directions = [
														{ x: 0, y: -1 },  // Up
														{ x: 0, y: 1 },   // Down
														{ x: -1, y: 0 },  // Left
														{ x: 1, y: 0 }    // Right
													];
													const randomDir = directions[Math.floor(Math.random() * directions.length)];

													// Spawn drop on adjacent tile
													const dropID = getNextDropID();
													spawnDrop(dropData, object.pixelX, object.pixelY, dropID, drops, TILE_SIZE, randomDir.x, randomDir.y);

													// Broadcast new drop to nearby players
													const drop = drops[dropID];
													if (drop) {
														broadcastToNearby(drop, {
															type: "drop",
															id: drop.id,
															name: drop.name,
															mapX: drop.mapX,
															mapY: drop.mapY,
															pixelX: drop.pixelX,
															pixelY: drop.pixelY
														}, wss, players);
													}
												}
											}
										}

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
											level: object.level,
											lastHitTime: object.lastHitTime
										}, wss, players);
									}
									break;
								}
							}
						}
					} 
					else if (data.dir === "interact" && data.pressed) {
						let boatStateChanged = false;

						//Check bounds before accessing MAP
						const mapHeight = MAP.length;
						const mapWidth = MAP[0].length;

						//Get into boat logic
						if (!player.inBoat) {
							if (player.mapY > 0 && (MAP[player.mapY - 2][player.mapX] === 0)) {
								player.mapY -= 2;
								player.pixelY -= TILE_SIZE * 2;
								player.targetY -= TILE_SIZE * 2;
								player.inBoat = true;
								boatStateChanged = true;
							} else if (player.mapY < mapHeight - 1 && MAP[player.mapY + 2][player.mapX] === 0) {
								player.mapY += 2;
								player.pixelY += TILE_SIZE * 2;
								player.targetY += TILE_SIZE * 2;
								player.inBoat = true;
								boatStateChanged = true;
							} else if (player.mapX < mapWidth - 1 && MAP[player.mapY][player.mapX + 2] === 0) {
								player.mapX += 2;
								player.pixelX += TILE_SIZE * 2;
								player.targetX += TILE_SIZE * 2;
								player.inBoat = true;
								boatStateChanged = true;
							} else if (player.mapX > 0 && MAP[player.mapY][player.mapX - 2] === 0) {
								player.mapX -= 2;
								player.pixelX -= TILE_SIZE * 2;
								player.targetX -= TILE_SIZE * 2;
								player.inBoat = true;
								boatStateChanged = true;
							}
						}
						//Get out of boat logic
						else {
							if (player.mapY > 0 && PASSABLE_TILES.includes(MAP[player.mapY - 2][player.mapX])) {
								player.mapY -= 2;
								player.pixelY -= TILE_SIZE * 2;
								player.targetY -= TILE_SIZE * 2;
								player.inBoat = false;
								boatStateChanged = true;
							} else if (player.mapY < mapHeight - 1 && PASSABLE_TILES.includes(MAP[player.mapY + 2][player.mapX])) {
								player.mapY += 2;
								player.pixelY += TILE_SIZE * 2;
								player.targetY += TILE_SIZE * 2;
								player.inBoat = false;
								boatStateChanged = true;
							} else if (player.mapX < mapWidth - 1 && PASSABLE_TILES.includes(MAP[player.mapY][player.mapX + 2])) {
								player.mapX += 2;
								player.pixelX += TILE_SIZE * 2;
								player.targetX += TILE_SIZE * 2;
								player.inBoat = false;
								boatStateChanged = true;
							} else if (player.mapX > 0 && PASSABLE_TILES.includes(MAP[player.mapY][player.mapX - 2])) {
								player.mapX -= 2;
								player.pixelX -= TILE_SIZE * 2;
								player.targetX -= TILE_SIZE * 2;
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

						const upgradesCoords = (
							(player.mapX === 1021 && player.mapY === 1300) ||
							(player.mapX === 1022 && player.mapY === 1299) ||
							(player.mapX === 1023 && player.mapY === 1300) ||
							(player.mapX === 1022 && player.mapY === 1301) ||
							(player.mapX === 1021 && player.mapY === 1300) ||
							(player.mapX === 1023 && player.mapY === 1300) ||
							(player.mapX === 1021 && player.mapY === 1299) ||
							(player.mapX === 1023 && player.mapY === 1299) ||
							(player.mapX === 1022 && player.mapY === 1300)
						);

						const sellingCoords = (
							(player.mapX === 1018 && player.mapY === 1301) ||
							(player.mapX === 1019 && player.mapY === 1300) ||
							(player.mapX === 1018 && player.mapY === 1299) ||
							(player.mapX === 1017 && player.mapY === 1300) ||
							(player.mapX === 1017 && player.mapY === 1299) ||
							(player.mapX === 1019 && player.mapY === 1299) ||
							(player.mapX === 1017 && player.mapY === 1301) ||
							(player.mapX === 1019 && player.mapY === 1301) ||
							(player.mapX === 1018 && player.mapY === 1300)
						);

						const potionShopCoords = (
							(player.mapX === 1020 && player.mapY === 1296) ||
							(player.mapX === 1021 && player.mapY === 1296) ||
							(player.mapX === 1021 && player.mapY === 1297) ||
							(player.mapX === 1021 && player.mapY === 1298) ||
							(player.mapX === 1020 && player.mapY === 1298) ||
							(player.mapX === 1019 && player.mapY === 1298) ||
							(player.mapX === 1019 && player.mapY === 1297) ||
							(player.mapX === 1019 && player.mapY === 1296) 
						);

						if (upgradesCoords) { //Check if player near shop
							ws.send(JSON.stringify({
								type: "shop",
								name: shops.SHOP1.name,
								inventory: shops.SHOP1.inventory
							}));
						} else if (sellingCoords) {
							ws.send(JSON.stringify({
								type: "sell",
							}));
						} else if (potionShopCoords) { //Check if player near potion shop
							ws.send(JSON.stringify({
								type: "shop",
								name: shops.POTION_SHOP.name,
								inventory: shops.POTION_SHOP.inventory
							}));
						}

					} else if (data.dir === "message" && data.pressed) {
						const targetPlayer = players[playerId];
						if (targetPlayer && targetPlayer.dbID === data.playerID) {
							targetPlayer.messages.push({
								text: data.message,
								timestamp: Date.now()
							});

							// Immediately broadcast the message to all players (including sender)
							broadcast({
								type: "update",
								id: targetPlayer.id,
								mapX: targetPlayer.mapX,
								mapY: targetPlayer.mapY,
								pixelX: targetPlayer.pixelX,
								pixelY: targetPlayer.pixelY,
								targetX: targetPlayer.targetX,
								targetY: targetPlayer.targetY,
								health: targetPlayer.health,
								maxHealth: targetPlayer.maxHealth,
								username: targetPlayer.username,
								level: targetPlayer.level,
								gold: targetPlayer.gold,
								messages: targetPlayer.messages
							}, wss);
						}
					} else if (data.dir === "deleteItem") {
						const targetPlayer = players[playerId];
						if (targetPlayer && targetPlayer.dbID === data.playerID && targetPlayer.inventory[data.item]) {
							const itemName = targetPlayer.inventory[data.item].itemName;

							// Check if item amount is greater than 0
							if (targetPlayer.inventory[data.item].itemAmount > 0) {
								// Find valid adjacent tile (base tiles 0, 1, 2, 3, 4 only)
								const validTiles = [0, 1, 2, 3, 4];
								const adjacentOffsets = [
									{ x: 0, y: -1 },  // Up
									{ x: 0, y: 1 },   // Down
									{ x: -1, y: 0 },  // Left
									{ x: 1, y: 0 },   // Right
									{ x: 0, y: 0 }    // Same tile (player's position)
								];

								let dropPosition = null;

								// Check each adjacent tile for validity
								for (const offset of adjacentOffsets) {
									const checkX = targetPlayer.mapX + offset.x;
									const checkY = targetPlayer.mapY + offset.y;

									// Check bounds
									if (checkY >= 0 && checkY < MAP.length && checkX >= 0 && checkX < MAP[0].length) {
										const tileValue = MAP[checkY][checkX];

										// Check if tile is a valid base tile
										if (validTiles.includes(tileValue)) {
											dropPosition = { x: checkX, y: checkY, offsetX: offset.x, offsetY: offset.y };
											break;
										}
									}
								}

								// If valid position found, drop the item
								if (dropPosition) {
									// Remove item from inventory
									try {
										const success = await deleteItem(itemName, targetPlayer.dbID, supabase, targetPlayer, data.item);
										if (success) {
											// Create drop at valid tile position
											const dropID = getNextDropID();
											const dropData = { name: itemName };

											// Spawn drop on the valid tile
											spawnDrop(dropData, targetPlayer.pixelX, targetPlayer.pixelY, dropID, drops, TILE_SIZE, dropPosition.offsetX, dropPosition.offsetY);

											// Broadcast new drop to nearby players
											const drop = drops[dropID];
											if (drop) {
												broadcastToNearby(drop, {
													type: "drop",
													id: drop.id,
													name: drop.name,
													mapX: drop.mapX,
													mapY: drop.mapY,
													pixelX: drop.pixelX,
													pixelY: drop.pixelY
												}, wss, players);
											}

											console.log(`${targetPlayer.username} dropped ${itemName} at (${dropPosition.x}, ${dropPosition.y})`);
										} else {
											console.log("Failed to delete item from inventory");
										}
									} catch (err) {
										console.error("Failed to drop item:", err);
									}
								} else {
									console.log("No valid tile found to drop item");
								}
							}
						}
					} else if (data.dir === "buyItem") {
						console.log(data.item)

						// Check which shop the item is from
						let itemPrice = null;
						let isUpgrade = false;
						let isPotion = false;

						if (shops.SHOP1.inventory[data.item]) {
							itemPrice = shops.SHOP1.inventory[data.item].itemValue;
							isUpgrade = true;
						} else if (shops.POTION_SHOP.inventory[data.item]) {
							itemPrice = shops.POTION_SHOP.inventory[data.item].itemValue;
							isPotion = true;
						}

						if (itemPrice && player.gold >= itemPrice) {
							player.gold -= itemPrice;

							if (isUpgrade) {
								// Handle upgrade items (permanent stat increases)
								if (data.item === "Health Upgrade") {
									player.maxHealth += 10;
									player.health = player.maxHealth;
									player.level += 1;
								} else if (data.item === "Speed Upgrade") {
									if (player.speed < 10) { //Ensure player is still controllable
										player.speed += 1;
										player.level += 1;
									}
								} else if (data.item === "Sword Upgrade") {
									player.damage += 1;
									player.level += 1;
								}
							} else if (isPotion) {
								// Handle potion items (add to inventory)
								if (!player.inventory[data.item]) {
									player.inventory[data.item] = {
										itemName: data.item,
										itemAmount: 1
									};
								} else {
									// Check if adding would exceed 999 limit
									if (player.inventory[data.item].itemAmount >= 999) {
										// Inventory full for this item, refund the player
										player.gold += itemValue;
										return;
									}
									player.inventory[data.item].itemAmount++;
								}

								// Save item to database
								saveItem(data.item, player.dbID, supabase);
							}

							saveProgress(player, supabase);

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
								maxHealth: player.maxHealth,
								username: player.username,
								level: player.level,
								gold: player.gold,
								inBoat: player.inBoat,
								inventory: player.inventory,
								speed: player.speed,
								damage: player.damage
							}, wss);
						}
					} else if (data.dir === "sellItem") {
						const sellingCoords = (
							(player.mapX === 1018 && player.mapY === 1301) ||
							(player.mapX === 1019 && player.mapY === 1300) ||
							(player.mapX === 1018 && player.mapY === 1299) ||
							(player.mapX === 1017 && player.mapY === 1300) ||
							(player.mapX === 1017 && player.mapY === 1299) ||
							(player.mapX === 1019 && player.mapY === 1299) ||
							(player.mapX === 1017 && player.mapY === 1301) ||
							(player.mapX === 1019 && player.mapY === 1301) ||
							(player.mapX === 1018 && player.mapY === 1300)
						);

						if (sellingCoords && player.inventory[data.item]) {
							const itemName = player.inventory[data.item].itemName;
							const itemValue = player.inventory[data.item].itemValue || 10; // Use stored value or default to 10

							// Only sell if item amount is greater than 0
							if (player.inventory[data.item].itemAmount > 0) {
								console.log(data.item, "sold for", itemValue, "gold");
								player.inventory[data.item].itemAmount -= 1;
								player.gold += itemValue;

								// Update database for item
								try {
									const success = await deleteItem(itemName, player.dbID, supabase, player, data.item);
									if (!success) {
										console.log("Failed to sell item in DB");
									}
								} catch (err) {
									console.error("Failed to sell item:", err);
								}

								// Save player progress (gold)
								saveProgress(player, supabase);

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
									maxHealth: player.maxHealth,
									username: player.username,
									level: player.level,
									gold: player.gold,
									inBoat: player.inBoat,
									inventory: player.inventory
								}, wss);
							}
						}
					} else if (data.dir === "consumeItem") {
						const targetPlayer = players[playerId];
						if (targetPlayer && targetPlayer.dbID === data.playerID && targetPlayer.inventory[data.item]) {
							const itemName = targetPlayer.inventory[data.item].itemName;

							// Check if item is consumable
							if (!isConsumable(itemName)) {
								console.log(`${targetPlayer.username} tried to consume non-consumable item: ${itemName}`);
								return;
							}

							// Only consume if item amount is greater than 0 and player is not max health
							if (targetPlayer.inventory[data.item].itemAmount > 0 && targetPlayer.health < targetPlayer.maxHealth) {

								targetPlayer.inventory[data.item].itemAmount -= 1;

								// Get healing amount from items configuration
								const healAmount = getHealthRestore(itemName);

								// Add health to player (cap at maxHealth)
								const oldHealth = targetPlayer.health;
								targetPlayer.health = Math.min(targetPlayer.maxHealth, targetPlayer.health + healAmount);

								// Mark health as changed if it actually changed
								if (targetPlayer.health !== oldHealth) {
									targetPlayer.healthChanged = true;
								}

								console.log(`${targetPlayer.username} consumed ${itemName} and healed ${targetPlayer.health - oldHealth} HP`);

								// Update database for item
								try {
									const success = await deleteItem(itemName, targetPlayer.dbID, supabase, targetPlayer, data.item);
									if (!success) {
										console.log("Failed to consume item in DB");
									}
								} catch (err) {
									console.error("Failed to consume item:", err);
								}

								// Save player progress (health and stats)
								saveProgress(targetPlayer, supabase);

								// Broadcast update to all clients
								broadcast({
									type: "update",
									id: targetPlayer.id,
									mapX: targetPlayer.mapX,
									mapY: targetPlayer.mapY,
									pixelX: targetPlayer.pixelX,
									pixelY: targetPlayer.pixelY,
									targetX: targetPlayer.targetX,
									targetY: targetPlayer.targetY,
									health: targetPlayer.health,
									maxHealth: targetPlayer.maxHealth,
									username: targetPlayer.username,
									level: targetPlayer.level,
									gold: targetPlayer.gold,
									inBoat: targetPlayer.inBoat,
									inventory: targetPlayer.inventory
								}, wss);
							}
						}
					}
				}

				//Handle typing indicator
				if (data.type === "typing") {
					if (playerId === null) {
						return;
					}

					const player = players[playerId];
					if (!player) {
						return;
					}

					player.isTyping = data.isTyping;

					// Broadcast typing status to nearby players
					broadcastToNearby(player, {
						type: "typing",
						id: playerId,
						isTyping: data.isTyping
					}, wss, players);
				}
			} catch (error) {
				console.error("Error processing message:", error);
			}
		});

		ws.on("close", async () => {
			if (playerId !== null) {
				const leavingPlayer = players[playerId];
				const username = leavingPlayer ? leavingPlayer.username : "Unknown Player";

				console.log(`Player ${username} disconnected.`);

				// Broadcast leave message to all remaining players as a system message
				broadcast({
					type: "systemMessage",
					text: `${username} left the game`,
					timestamp: Date.now(),
					color: "yellow"
				}, wss);

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

	startGame(wss, TILE_SIZE, VISIBLE_TILES_X, VISIBLE_TILES_Y, PASSABLE_TILES, PLAYER_SPAWN, ENEMY_SPAWNS, OBJECT_SPAWNS, MAP, supabase, biomes);
}