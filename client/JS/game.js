import { loadImages, sprites, playerImages, boatSprite } from "./images.js";
import {
	drawMap, drawPlayer, drawEnemy, drawDrop, drawObject, drawInventory, isNearby,
	drawHUD, drawShopInventory, drawChatBox, drawPickupNotifications, drawChatToggleButton,
	drawMinimap, drawMobileChatBox, drawMobileKeyboard
} from "./functions.js"

export function startGame({ userId, token }) {
	const socket = new WebSocket("wss://ws.zombieisland.online/"); //Prod server
	//const socket = new WebSocket("ws://localhost:8080"); //Local server

	socket.onopen = () => {
		console.log("Connected to server");

		socket.send(JSON.stringify({
			type: "auth",
			token
		}));
	};

	const canvas = document.getElementById("game");
	const ctx = canvas.getContext("2d");
	const TILE_SIZE = 64; //Tile size in pixels

	let mouseLeftX = 0;
	let mouseLeftY = 0;
	let mouseLeftClicked = false;

	let selectedItem = null;

	const rect = canvas.getBoundingClientRect();

	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	canvas.addEventListener('contextmenu', (e) => {
		e.preventDefault();
	});

	canvas.addEventListener('mousedown', (e) => {
		// Only handle left mouse button (button 0)
		if (e.button === 0) {
			mouseLeftX = (e.clientX - rect.left) * scaleX;
			mouseLeftY = (e.clientY - rect.top) * scaleY;
			mouseLeftClicked = true;
		}
	});

	// Mobile touch controls
	let activeTouches = new Map(); // Track active touch buttons
	let touchStartTimes = new Map(); // Track when each touch started (for hold detection)
	let touchStartPositions = new Map(); // Track where each touch started

	let lastTouchWasButton = false; // Track if last touch was on a mobile button
	let lastShopPurchaseTime = 0; // Prevent rapid-fire purchases
	const SHOP_PURCHASE_COOLDOWN = 300; // 300ms cooldown between purchases

	canvas.addEventListener('touchstart', (e) => {
		e.preventDefault();
		for (let i = 0; i < e.touches.length; i++) {
			const touch = e.touches[i];
			const touchX = (touch.clientX - rect.left) * scaleX;
			const touchY = (touch.clientY - rect.top) * scaleY;

			// Store touch for mobile button handling
			activeTouches.set(touch.identifier, { x: touchX, y: touchY });
			touchStartTimes.set(touch.identifier, Date.now());
			touchStartPositions.set(touch.identifier, { x: touchX, y: touchY });

			// Set mouse position for potential UI clicks
			mouseLeftX = touchX;
			mouseLeftY = touchY;
			// Will set mouseLeftClicked = true later if not touching a mobile button
			lastTouchWasButton = false;
		}
	});

	canvas.addEventListener('touchend', (e) => {
		e.preventDefault();
		for (let i = 0; i < e.changedTouches.length; i++) {
			const touch = e.changedTouches[i];
			const touchEndX = (touch.clientX - rect.left) * scaleX;
			const touchEndY = (touch.clientY - rect.top) * scaleY;
			const touchStartTime = touchStartTimes.get(touch.identifier);
			const touchStartPos = touchStartPositions.get(touch.identifier);
			const touchDuration = Date.now() - (touchStartTime || 0);


			const isHold = touchDuration > 500; // 500ms = hold
			const moveDist = touchStartPos ? Math.sqrt(Math.pow(touchEndX - touchStartPos.x, 2) + Math.pow(touchEndY - touchStartPos.y, 2)) : 0;
			const isTap = touchDuration < 500 && moveDist < 20;

			if (isMobile && mobileKeyboardVisible && mobileKeyboardData && isTap) {
				let keyPressed = false;
				for (const keyData of mobileKeyboardData.keys) {
					if (touchEndX >= keyData.x && touchEndX <= keyData.x + keyData.width &&
					    touchEndY >= keyData.y && touchEndY <= keyData.y + keyData.height) {

						if (keyData.key === 'Close') {
							// Close keyboard
							mobileKeyboardVisible = false;
							isTyping = false;
							socket.send(JSON.stringify({
								type: "typing",
								isTyping: false,
								playerID: userId
							}));
						} else if (keyData.key === 'Enter') {
							// Send message
							if (inputString.trim()) {
								socket.send(JSON.stringify({
									type: "keydown",
									dir: "message",
									pressed: true,
									playerID: userId,
									message: inputString
								}));
							}
							inputString = "";
							mobileKeyboardVisible = false;
							isTyping = false;
							socket.send(JSON.stringify({
								type: "typing",
								isTyping: false,
								playerID: userId
							}));
						} else if (keyData.key === 'Backspace') {
							// Remove last character
							inputString = inputString.slice(0, -1);
						} else {
							// Add character to input
							inputString += keyData.key;
						}

						keyPressed = true;
						break;
					}
				}

				// If keyboard key was pressed, skip all other touch handling
				if (keyPressed) {
					activeTouches.delete(touch.identifier);
					touchStartTimes.delete(touch.identifier);
					touchStartPositions.delete(touch.identifier);
					continue;
				}
			}

			// Handle chat box tap to open keyboard (only when keyboard is closed)
			if (isMobile && !mobileKeyboardVisible && chatBoxBounds && isTap) {
				if (touchEndX >= chatBoxBounds.chatX && touchEndX <= chatBoxBounds.chatX + chatBoxBounds.chatWidth &&
				    touchEndY >= chatBoxBounds.chatY && touchEndY <= chatBoxBounds.chatY + chatBoxBounds.chatHeight) {
					mobileKeyboardVisible = true;
					isTyping = true;
					inputString = "";
					socket.send(JSON.stringify({
						type: "typing",
						isTyping: true,
						playerID: userId
					}));
					activeTouches.delete(touch.identifier);
					touchStartTimes.delete(touch.identifier);
					touchStartPositions.delete(touch.identifier);
					continue;
				}
			} 


			if (isTap || isHold) {
				if (inInventory && !inShopInventory && !inSellInventory) {
					for (const item in inventory) {
						const currentItem = inventory[item];
						if (currentItem.itemAmount > 0) {
							if (touchEndX >= currentItem.xPosition && touchEndX <= currentItem.xPosition + 80 &&
							    touchEndY >= currentItem.yPosition && touchEndY <= currentItem.yPosition + 80) {

								if (isHold) {
									// Hold = drop item
									socket.send(JSON.stringify({
										type: "keydown",
										dir: "deleteItem",
										pressed: true,
										playerID: userId,
										item: currentItem.itemName
									}));
								} else if (isTap) {
									// Tap = consume item
									socket.send(JSON.stringify({
										type: "keydown",
										dir: "consumeItem",
										pressed: true,
										playerID: userId,
										item: currentItem.itemName
									}));
								}
								break;
							}
						}
					}
				}
		
				else if (inShopInventory && isTap) {
					const now = Date.now();
					if (now - lastShopPurchaseTime >= SHOP_PURCHASE_COOLDOWN) {
						for (const item in shopInventory) {
							const currentItem = shopInventory[item];
							if (touchEndX >= currentItem.xPosition && touchEndX <= currentItem.xPosition + 80 &&
							    touchEndY >= currentItem.yPosition && touchEndY <= currentItem.yPosition + 80) {

									// Check if upgrade is already maxed before sending request
									const player = players[playerId];
									const isMaxed = (currentItem.itemName === "Speed Upgrade" && player.speed >= 10) ||
									                (currentItem.itemName === "Health Upgrade" && player.maxHealth >= 1000) ||
									                (currentItem.itemName === "Sword Upgrade" && player.damage >= 50);

									if (!isMaxed) {
										socket.send(JSON.stringify({
											type: "keydown",
											dir: "buyItem",
											pressed: true,
											playerID: userId,
											item: currentItem.itemName
										}));
										lastShopPurchaseTime = now;
									}
									break;
							}
						}
					}
				}
	
				else if (inSellInventory && isTap) {
					const now = Date.now();
					if (now - lastShopPurchaseTime >= SHOP_PURCHASE_COOLDOWN) {
						for (const item in inventory) {
							const currentItem = inventory[item];
							if (touchEndX >= currentItem.xPosition && touchEndX <= currentItem.xPosition + 80 &&
							    touchEndY >= currentItem.yPosition && touchEndY <= currentItem.yPosition + 80) {
								socket.send(JSON.stringify({
									type: "keydown",
									dir: "sellItem",
									pressed: true,
									playerID: userId,
									item: currentItem.itemName
								}));
								lastShopPurchaseTime = now;
								break;
							}
						}
					}
				}
			}

			activeTouches.delete(touch.identifier);
			touchStartTimes.delete(touch.identifier);
			touchStartPositions.delete(touch.identifier);
		}
	});

	canvas.addEventListener('touchmove', (e) => {
		e.preventDefault();
		for (let i = 0; i < e.touches.length; i++) {
			const touch = e.touches[i];
			const touchX = (touch.clientX - rect.left) * scaleX;
			const touchY = (touch.clientY - rect.top) * scaleY;

			// Update touch position
			activeTouches.set(touch.identifier, { x: touchX, y: touchY });
		}
	});

	let playerId = null; //player ID (not userID)

	let players = {}; //All players
	let enemies = {}; //All enemies
	let drops = {} //All drops
	let objects = {} //All objects

	// Client-side prediction for local player
	let predictedPosition = { mapX: 0, mapY: 0, pixelX: 0, pixelY: 0, targetX: 0, targetY: 0 };

	let inInventory = false;
	let inShopInventory = false;
	let inSellInventory = false;
	let inControlsMenu = false;
	let chatBoxVisible = true;
	let minimapVisible = true;

	let shopInventory = {};
	let shopName = "";
	let shopPosition = null; // Store shop position when opened
	let inventory = {};

	// Load minimap image
	const minimapImage = new Image();
	minimapImage.src = "../assets/HUD/map.png";

	// Load controls menu image
	const controlsImage = new Image();
	controlsImage.src = "../assets/UI/controls.png";

	// Load water sprite animation
	const waterSprite = new Image();
	waterSprite.src = "../assets/map/Water/water-sprite.png";
	let waterFrameIndex = 0;
	let waterFrameTimer = 0;
	const WATER_FRAME_DELAY = 500; // 500ms between frames
	const WATER_FRAME_SIZE = 64;
	const WATER_FRAME_COUNT = 4;

	let globalChatMessages = []; // Global chat message queue
	let pickupNotifications = []; // Item pickup notifications queue

	let lastFrameTime = performance.now(); //Last frame time
	let frameCount = 0;  //Frames counted
	let lastFpsUpdate = 0; //Last FPS check
	let currentFps = 0;  //Current FPS

	const TARGET_FPS = 60; //Target frames per second
	const FRAME_TIME = 1000 / TARGET_FPS; //Time per frame
	const INTERPOLATION_SPEED = 10.5; //Movement speed

	//Cache for nearby entities to reduce repeated calculations
	let nearbyCache = {
		enemies: new Set(),
		objects: new Set(),
		players: new Set(),
		drops: new Set(),
		lastUpdate: 0
	};

	//Cache enemy sprite keys
	const enemySpriteCache = new Map();
	let cleanupCounter = 0;
	const CLEANUP_FREQUENCY = 60; //Clean up dead entities every 60 frames

	function ensurePlayerDefaults(player) {
		if (!player.action) player.action = "idle";
		if (!player.direction) player.direction = "down";
		if (typeof player.frameIndex !== 'number') player.frameIndex = 0;
		if (typeof player.frameTimer !== 'number') player.frameTimer = 0;
		if (player.inBoat === undefined) player.inBoat = false;
	}

	function getEnemySprite(enemy) {
		const isAlive = Math.floor(enemy.health) > 0;
		const spriteKey = `${enemy.name}-${isAlive ? enemy.action : 'death'}`;
		
		if (!enemySpriteCache.has(spriteKey)) {
			enemySpriteCache.set(spriteKey, sprites[spriteKey]);
		}
		
		return enemySpriteCache.get(spriteKey);
	}

	function cleanupDeadEntities() {
		if (++cleanupCounter < CLEANUP_FREQUENCY) return;
		cleanupCounter = 0;

		for (const enemyID in enemies) {
			const enemy = enemies[enemyID];
			// Only delete if dead AND death animation is complete
			if (Math.floor(enemy.health) < 1 && enemy.deathAnimationComplete) {
				delete enemies[enemyID];
				nearbyCache.enemies.delete(enemyID);
			}
		}

		for (const objectID in objects) {
			if (Math.floor(objects[objectID].health) < 1) {
				delete objects[objectID];
				nearbyCache.objects.delete(objectID);
			}
		}
	}

	socket.onmessage = (event) => {
		const msg = JSON.parse(event.data);

		if ("init" === msg.type) { //Initial game setup
			playerId = msg.id;
			if (msg.player) {
				players[msg.id] = msg.player;
				const player = players[msg.id];
				player.pixelX = Number(player.pixelX) || Number(player.mapX || 42) * TILE_SIZE;
				player.pixelY = Number(player.pixelY) || Number(player.mapY || 46) * TILE_SIZE;
				player.targetX = Number(player.targetX) || player.pixelX;
				player.targetY = Number(player.targetY) || player.pixelY;
				ensurePlayerDefaults(player); // Ensure player has valid defaults

				// Initialize predicted position
				predictedPosition = {
					mapX: player.mapX,
					mapY: player.mapY,
					pixelX: player.pixelX,
					pixelY: player.pixelY,
					targetX: player.targetX,
					targetY: player.targetY
				};
			}

		} else if ("join" === msg.type) { //New player joined
			players[msg.player.id] = msg.player;
			const player = players[msg.player.id];
			if (!player.pixelX) player.pixelX = player.mapX * TILE_SIZE;
			if (!player.pixelY) player.pixelY = player.mapY * TILE_SIZE;
			if (!player.targetX) player.targetX = player.pixelX;
			if (!player.targetY) player.targetY = player.pixelY;
			ensurePlayerDefaults(player); //Ensure new player has valid defaults

		} else if ("systemMessage" === msg.type) { //System message (join/leave)
			// Add system message to global chat
			globalChatMessages.push({
				text: msg.text,
				timestamp: msg.timestamp || Date.now(),
				color: msg.color || "yellow",
				isSystem: true
			});

		} else if ("chatMessage" === msg.type) { //Global chat message
			// Add chat message to global chat from any player
			globalChatMessages.push({
				username: msg.username,
				text: msg.message,
				timestamp: msg.timestamp || Date.now()
			});

			// Update player's messages array for overhead chat bubble
			const player = players[msg.playerID];
			if (player) {
				if (!player.messages) {
					player.messages = [];
				}
				player.messages.push({
					text: msg.message,
					timestamp: msg.timestamp || Date.now()
				});
			}

		} else if ("update" === msg.type) { //Player update
			if (!players[msg.id]) {
				return;
			} //Skip if invalid player
			const player = players[msg.id];

			//Only update if player is nearby OR it's the current player
			if (msg.id === playerId || isNearby([players[playerId].mapX, players[playerId].mapY], [msg.mapX, msg.mapY])) {
				// Track gold and health changes for current player
				if (msg.id === playerId) {
					// Track gold changes
					if (msg.gold !== undefined && player.gold !== undefined) {
						const goldDiff = msg.gold - player.gold;
						if (goldDiff > 0) {
							pickupNotifications.push({
								itemName: "Gold",
								amount: goldDiff,
								timestamp: Date.now()
							});
						}
					}

					// Track health changes (gains only)
					if (msg.health !== undefined && player.health !== undefined) {
						const healthDiff = Number(msg.health) - player.health;
						if (healthDiff > 0) {
							pickupNotifications.push({
								itemName: "Health",
								amount: healthDiff,
								timestamp: Date.now()
							});
						}
					}
				}

				if (msg.health !== undefined) player.health = Number(msg.health);
				if (msg.maxHealth !== undefined) player.maxHealth = msg.maxHealth;
				if (msg.mapX !== undefined) player.mapX = Number(msg.mapX);
				if (msg.mapY !== undefined) player.mapY = Number(msg.mapY);
				if (msg.pixelX !== undefined) player.pixelX = Number(msg.pixelX);
				if (msg.pixelY !== undefined) player.pixelY = Number(msg.pixelY);
				if (msg.targetX !== undefined) player.targetX = Number(msg.targetX);
				if (msg.targetY !== undefined) player.targetY = Number(msg.targetY);
				if (msg.username !== undefined) player.username = msg.username;
				if (msg.level !== undefined) player.level = msg.level;
				if (msg.gold !== undefined) player.gold = msg.gold;
				if (msg.speed !== undefined) player.speed = msg.speed;
				if (msg.damage !== undefined) player.damage = msg.damage;
				if (msg.direction !== undefined) player.direction = msg.direction;
				if (msg.action !== undefined) {
					// If this is the current player and they're attacking,
					// ignore ALL server action updates - client fully controls attack animation
					if (msg.id === playerId && player.action === "attack") {
						// Client is animating attack, ignore all server action updates
					} else {
						// For other players, trust server's action updates
					const previousAction = player.action;
					player.action = msg.action;
					// Reset frame whenever action changes
					if (previousAction !== msg.action) {
						player.frameIndex = 0;
						player.frameTimer = 0;
					}
				}
				}
				if (msg.inBoat !== undefined) player.inBoat = msg.inBoat;

				// Update predicted position for local player based on server correction
				if (msg.id === playerId) {
					// Smoothly reconcile prediction with server position
					const errorThreshold = TILE_SIZE * 2; // If error is more than 2 tiles, snap to server position
					const errorX = Math.abs(predictedPosition.targetX - player.targetX);
					const errorY = Math.abs(predictedPosition.targetY - player.targetY);

					if (errorX > errorThreshold || errorY > errorThreshold) {
						// Large error - snap to server position
						predictedPosition.targetX = player.targetX;
						predictedPosition.targetY = player.targetY;
						predictedPosition.pixelX = player.pixelX;
						predictedPosition.pixelY = player.pixelY;
						predictedPosition.mapX = player.mapX;
						predictedPosition.mapY = player.mapY;
					} else {
						// Small error - gently correct prediction
						predictedPosition.targetX += (player.targetX - predictedPosition.targetX) * 0.3;
						predictedPosition.targetY += (player.targetY - predictedPosition.targetY) * 0.3;
					}
				}
				if (msg.messages !== undefined) {
					player.messages = msg.messages;
					// Add new messages to global chat
					for (const message of msg.messages) {
						const existingMessage = globalChatMessages.find(m =>
							m.username === player.username &&
							m.text === message.text &&
							m.timestamp === message.timestamp
						);
						if (!existingMessage) {
							globalChatMessages.push({
								username: player.username,
								text: message.text,
								timestamp: message.timestamp || Date.now()
							});
						}
					}
				}

				if (msg.id === playerId) {
					if (msg.map) player.map = msg.map;
					if (msg.inventory) {
						// Detect new items for pickup notifications
						for (const itemName in msg.inventory) {
							const newItem = msg.inventory[itemName];
							const oldItem = inventory[itemName];

							// If item amount increased, show notification
							if (oldItem && newItem.itemAmount > oldItem.itemAmount) {
								const amountGained = newItem.itemAmount - oldItem.itemAmount;
								pickupNotifications.push({
									itemName: itemName,
									amount: amountGained,
									timestamp: Date.now()
								});
							} else if (!oldItem && newItem.itemAmount > 0) {
								// New item added
								pickupNotifications.push({
									itemName: itemName,
									amount: newItem.itemAmount,
									timestamp: Date.now()
								});
							}
						}
						inventory = msg.inventory;
					}
				}

				ensurePlayerDefaults(player);
			}

		} else if ("enemy" === msg.type) { //enemy update
			// Only process if nearby
			if (playerId && players[playerId] && isNearby([players[playerId].mapX, players[playerId].mapY], [msg.mapX, msg.mapY])) {
				let enemy = enemies[msg.id];
				
				if (!enemy) { //New enemy
					enemies[msg.id] = {
						mapX: msg.mapX,
						mapY: msg.mapY,
						pixelX: msg.pixelX,
						pixelY: msg.pixelY,
						targetX: msg.targetX,
						targetY: msg.targetY,
						health: msg.health,
						maxHealth: msg.maxHealth,
						name: msg.name,
						level: msg.level,
						direction: msg.direction || "down",
						action: msg.action || "idle",
						frameIndex: 0,
						frameTimer: 0
					};
				} else { //Existing enemy - direct property assignment
					if (msg.mapX !== undefined) enemy.mapX = msg.mapX;
					if (msg.mapY !== undefined) enemy.mapY = msg.mapY;
					if (msg.pixelX !== undefined) enemy.pixelX = msg.pixelX;
					if (msg.pixelY !== undefined) enemy.pixelY = msg.pixelY;
					if (msg.targetX !== undefined) enemy.targetX = msg.targetX;
					if (msg.targetY !== undefined) enemy.targetY = msg.targetY;
					if (msg.health !== undefined) enemy.health = msg.health;
					if (msg.maxHealth !== undefined) enemy.maxHealth = msg.maxHealth;
					if (msg.name !== undefined) enemy.name = msg.name;
					if (msg.level !== undefined) enemy.level = msg.level;
					if (msg.direction !== undefined) enemy.direction = msg.direction;
					if (msg.action !== undefined) enemy.action = msg.action;
				}
				nearbyCache.enemies.add(msg.id);
			}

		} else if ("drop" === msg.type) {
			if (playerId && players[playerId] && isNearby([msg.mapX, msg.mapY], [players[playerId].mapX, players[playerId].mapY])) {
				drops[msg.id] = {
					name: msg.name,
					mapX: msg.mapX,
					mapY: msg.mapY,
					pixelX: msg.pixelX,
					pixelY: msg.pixelY
				};
				nearbyCache.drops.add(msg.id);
			}

		} else if ("dropDelete" === msg.type) {
			// Remove drop from client when picked up
			delete drops[msg.id];
			nearbyCache.drops.delete(msg.id);

		} else if ("object" === msg.type) {
			if (playerId && players[playerId] && isNearby([players[playerId].mapX, players[playerId].mapY], [msg.mapX, msg.mapY])) {
				let object = objects[msg.id];

				if (!object) { //New object
					objects[msg.id] = {
						mapX: msg.mapX,
						mapY: msg.mapY,
						pixelX: msg.pixelX,
						pixelY: msg.pixelY,
						health: msg.health,
						maxHealth: msg.maxHealth,
						name: msg.name,
						lastHitTime: msg.lastHitTime ? Date.now() : undefined
					};
				} else { //Existing object - direct property assignment
					if (msg.mapX !== undefined) object.mapX = msg.mapX;
					if (msg.mapY !== undefined) object.mapY = msg.mapY;
					if (msg.pixelX !== undefined) object.pixelX = msg.pixelX;
					if (msg.pixelY !== undefined) object.pixelY = msg.pixelY;
					if (msg.health !== undefined) object.health = msg.health;
					if (msg.maxHealth !== undefined) object.maxHealth = msg.maxHealth;
					if (msg.name !== undefined) object.name = msg.name;
					if (msg.lastHitTime !== undefined) object.lastHitTime = Date.now();
				}
				nearbyCache.objects.add(msg.id);
			}

		} else if ("shop" === msg.type) {
			inInventory = false; // Close player inventory when shop opens
			inShopInventory = true;
			shopInventory = msg.inventory;
			shopName = msg.name;
			// Store current player position when shop opens
			if (players[playerId]) {
				shopPosition = { mapX: players[playerId].mapX, mapY: players[playerId].mapY };
			}

		} else if ("sell" === msg.type) {
			inInventory = false; // Close player inventory when sell inventory opens
			inSellInventory = true;
			// Store current player position when sell inventory opens
			if (players[playerId]) {
				shopPosition = { mapX: players[playerId].mapX, mapY: players[playerId].mapY };
			}

		} else if ("typing" === msg.type) {
			if (players[msg.id]) {
				players[msg.id].isTyping = msg.isTyping;
			}

		} else if ("leave" === msg.type) { //Player left
			delete players[msg.id];
			nearbyCache.players.delete(msg.id);
		}
	};

	const keysHeld = {};
	const controls = { //Keybindings
		"w": {"key": "up", "direction": "up", "action": "walk"}, 
		"W": {"key": "up", "direction": "up", "action": "walk"}, 
		"a": {"key": "left", "direction": "left", "action": "walk"}, 
		"A": {"key": "left", "direction": "left", "action": "walk"}, 
		"s": {"key": "down", "direction": "down", "action": "walk"}, 
		"S": {"key": "down", "direction": "down", "action": "walk"}, 
		"d": {"key": "right", "direction": "right", "action": "walk"}, 
		"D": {"key": "right", "direction": "right", "action": "walk"}, 
		" ": {"key": "attack", "direction": "current", "action": "attack"}, 
		"e": {"key": "interact", "direction": "current", "action": "idle"}, 
		"E": {"key": "interact", "direction": "current", "action": "idle"}, 
		"i": {"key": "inventory", "direction": "current", "action": "idle"}, 
		"I": {"key": "inventory", "direction": "current", "action": "idle"},
	};

	let isTyping = false;
	let inputString = "";

	let interactKeyBlocked = false; // Flag to prevent E from reopening shop

	// Detect if on mobile device (force mobile for testing or use device detection)
	const isMobile = window.innerWidth <= 768 || // Mobile screen size
	                 /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
	                 ('ontouchstart' in window) ||
	                 (navigator.maxTouchPoints > 0);

	// Mobile chat input handling
	let chatBoxBounds = null; // Store chat box position for touch detection
	let mobileKeyboardVisible = false; // Track on-screen keyboard visibility
	let mobileKeyboardData = null; // Store keyboard key positions

	window.addEventListener("keydown", (e) => {
		// Close controls menu on any key press when open
		if (inControlsMenu) {
			inControlsMenu = false;
			return; // Stop processing to prevent reopening the menu
		}

		// Close shop/sell inventory on any key press when open
		if (inShopInventory) {
			shopInventory = {};
			inShopInventory = false;
			shopPosition = null;
			// Block only the interact key if E was pressed
			if (e.key === "e" || e.key === "E") {
				interactKeyBlocked = true;
				setTimeout(() => { interactKeyBlocked = false; }, 10);
			}
			// Don't return - let the key event continue to second handler for movement
		} else if (inSellInventory) {
			inSellInventory = false;
			shopPosition = null;
			// Block only the interact key if E was pressed
			if (e.key === "e" || e.key === "E") {
				interactKeyBlocked = true;
				setTimeout(() => { interactKeyBlocked = false; }, 10);
			}
			// Don't return - let the key event continue to second handler for movement
		}

		if (!isTyping && (e.key === "t" || e.key === "T")) {
			chatBoxVisible = true; // Open chat when starting to type
			isTyping = true;
			inputString = "";

			// On mobile, focus the hidden input to show keyboard
			if (isMobile && mobileChatInput) {
				mobileChatInput.value = inputString;
				mobileChatInput.focus();
			}

			socket.send(JSON.stringify({
				type: "typing",
				isTyping: true,
				playerID: userId
			}));
		} else if (isTyping) {
			if ("Enter" === e.key) {
				isTyping = false;
				socket.send(JSON.stringify({
					type: "keydown",
					dir: "message",
					pressed: true,
					playerID: userId,
					message: inputString
				}));
				socket.send(JSON.stringify({
					type: "typing",
					isTyping: false,
					playerID: userId
				}));
			} else if ("Escape" === e.key) {
				isTyping = false;
				socket.send(JSON.stringify({
					type: "typing",
					isTyping: false,
					playerID: userId
				}));
			} else if (1 === e.key.length) {
				inputString += e.key;
			} else if ("Backspace" === e.key) {
				inputString = inputString.slice(0, -1);
			}
		} else if ("Escape" === e.key) {
			// Toggle controls menu - closing is handled at top of function
			if (!inControlsMenu) {
				inInventory = false;
				inControlsMenu = true;
			}
		} else if ("i" === e.key) {
			inInventory = !inInventory;
		} 
	});

	window.addEventListener("keydown", (event) => {
		const control = controls[event.key];
		// Don't process controls if typing or player not ready
		if (!control || isTyping || !playerId || !players[playerId]) return;

		// Block only interact key if shop just closed
		if (interactKeyBlocked && control.key === "interact") return;

		const key = control.key;
		const player = players[playerId];

		// Check if key is already held (prevent keyboard repeat)
		if (key && keysHeld[key]) {
			return;
		}

		// Set keysHeld and send to server
		if (key) {
			keysHeld[key] = true;
			socket.send(JSON.stringify({
				type: "keydown",
				dir: key,
				pressed: true,
				playerID: userId,
			}));
		}

		// Handle attack key separately
		if (key === "attack") {
			// Only start attack if not already attacking AND attack timer isn't active
			if (player.action !== "attack" && (!player.attackEndTime || Date.now() >= player.attackEndTime)) {
				player.action = "attack";
				player.frameIndex = 0;
				player.frameTimer = 0;
				player.attackEndTime = Date.now() + 400; // Attack lasts 800ms (8 frames * 100ms)
			}
		} else {
			// For non-attack keys, update action and direction
			player.action = control.action;

			if (control.direction !== "current") {
				player.direction = control.direction;
			}

			// Client-side prediction: immediately update predicted position for movement keys
			if (key === "up" || key === "down" || key === "left" || key === "right") {
				const speed = player.speed || 1;
				switch(key) {
					case "up":
						predictedPosition.targetY = predictedPosition.targetY - (TILE_SIZE * speed);
						predictedPosition.mapY = Math.round(predictedPosition.targetY / TILE_SIZE);
						break;
					case "down":
						predictedPosition.targetY = predictedPosition.targetY + (TILE_SIZE * speed);
						predictedPosition.mapY = Math.round(predictedPosition.targetY / TILE_SIZE);
						break;
					case "left":
						predictedPosition.targetX = predictedPosition.targetX - (TILE_SIZE * speed);
						predictedPosition.mapX = Math.round(predictedPosition.targetX / TILE_SIZE);
						break;
					case "right":
						predictedPosition.targetX = predictedPosition.targetX + (TILE_SIZE * speed);
						predictedPosition.mapX = Math.round(predictedPosition.targetX / TILE_SIZE);
						break;
				}
			}
		}
	});

	window.addEventListener("keyup", (event) => {
		const control = controls[event.key];
		if (!control || isTyping || !playerId || !players[playerId]) return;

		const key = control.key;
		if (key) {
			keysHeld[key] = false;

			socket.send(JSON.stringify({
				type: "keydown",
				dir: key,
				pressed: false,
				playerID: userId,
			}));

			const player = players[playerId];

			// Skip action updates for attack key - server handles it
			if (key === "attack") {
				return;
			}

			if (!keysHeld.up && !keysHeld.down && !keysHeld.left && !keysHeld.right) {
				player.action = "idle";
			} else {
				if (keysHeld.up) player.direction = "up";
				else if (keysHeld.down) player.direction = "down";
				else if (keysHeld.left) player.direction = "left";
				else if (keysHeld.right) player.direction = "right";
				player.action = "walk";
			}
		}
	});

	function tileTransition(start, end, time) {
		return start + (end - start) * time;
	}

	function draw(currentTime) {
		//Early exit if not ready
		if (!playerId || !players[playerId]) {
			requestAnimationFrame(draw);
			return;
		}

		const currentPlayer = players[playerId];
		
		cleanupDeadEntities();

		//FPS calculation
		frameCount++;
		if (currentTime - lastFpsUpdate >= 1000) {
			currentFps = frameCount;
			frameCount = 0;
			lastFpsUpdate = currentTime;
		}

		const deltaTime = Math.min(0.1, (currentTime - lastFrameTime) / 1000);
		lastFrameTime = currentTime;
		const time = Math.min(1, deltaTime * INTERPOLATION_SPEED);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//Update nearby cache
		if (currentTime - nearbyCache.lastUpdate > 200) {
			nearbyCache.enemies.clear();
			nearbyCache.objects.clear();
			nearbyCache.players.clear();
			nearbyCache.drops.clear();

			for (const id in enemies) {
				if (isNearby([currentPlayer.mapX, currentPlayer.mapY], [enemies[id].mapX, enemies[id].mapY])) {
					nearbyCache.enemies.add(id);
				}
			}

			for (const id in objects) {
				if (isNearby([currentPlayer.mapX, currentPlayer.mapY], [objects[id].mapX, objects[id].mapY])) {
					nearbyCache.objects.add(id);
				}
			}

			for (const id in players) {
				if (id !== playerId && isNearby([currentPlayer.mapX, currentPlayer.mapY], [players[id].mapX, players[id].mapY])) {
					nearbyCache.players.add(id);
				}
			}

			for (const id in drops) {
				if (isNearby([currentPlayer.mapX, currentPlayer.mapY], [drops[id].mapX, drops[id].mapY])) {
					nearbyCache.drops.add(id);
				}
			}

			nearbyCache.lastUpdate = currentTime;
		}

		//Delete far away entities using cached nearby data
		for (const id in enemies) {
			if (!nearbyCache.enemies.has(id)) {
				delete enemies[id];
			}
		}
		
		for (const id in objects) {
			if (!nearbyCache.objects.has(id) || objects[id].health <= 0) {
				delete objects[id];
			}
		}

		//Update positions for all players
		for (const id in players) {
			const player = players[id];

			// Use predicted position for local player, server position for others
			if (id === playerId) {
				// Interpolate predicted position
				predictedPosition.pixelX = tileTransition(predictedPosition.pixelX, predictedPosition.targetX, time);
				predictedPosition.pixelY = tileTransition(predictedPosition.pixelY, predictedPosition.targetY, time);

				// Override player's render position with predicted position
				player.renderPixelX = predictedPosition.pixelX;
				player.renderPixelY = predictedPosition.pixelY;
			} else {
				// Use server-authoritative position for other players
				player.pixelX = tileTransition(player.pixelX, player.targetX, time);
				player.pixelY = tileTransition(player.pixelY, player.targetY, time);
				player.renderPixelX = player.pixelX;
				player.renderPixelY = player.pixelY;
			}
		}

		//Update enemy positions and animations
		for (const id of nearbyCache.enemies) {
			const enemy = enemies[id];
			if (!enemy) continue;

			enemy.pixelX = tileTransition(enemy.pixelX, enemy.targetX, time);
			enemy.pixelY = tileTransition(enemy.pixelY, enemy.targetY, time);
			enemy.frameTimer += deltaTime * 1000;

			const frameDelay = 100;
			const sprite = getEnemySprite(enemy);

			if (sprite) {
				const frameAmount = sprite[2];
				const isDead = Math.floor(enemy.health) <= 0;

				if (enemy.frameTimer >= frameDelay) {
					enemy.frameTimer = 0;

					if (isDead) {
						// For death animation, don't loop - stop at last frame
						if (enemy.frameIndex < frameAmount - 1) {
							enemy.frameIndex++;
						} else {
							// Mark as ready for deletion after animation completes
							enemy.deathAnimationComplete = true;
						}
					} else {
						// Normal looping animation
						enemy.frameIndex = (enemy.frameIndex + 1) % frameAmount;
					}
				}
			}
		}

		//Animate water
		waterFrameTimer += deltaTime * 1000;
		if (waterFrameTimer >= WATER_FRAME_DELAY) {
			waterFrameTimer = 0;
			waterFrameIndex = (waterFrameIndex + 1) % WATER_FRAME_COUNT;
		}

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		drawMap(currentPlayer, waterSprite, waterFrameIndex, WATER_FRAME_SIZE);

		//Draw other players
		for (const id of nearbyCache.players) {
			const player = players[id];
			if (!player) continue;

			//Ensure player has valid defaults before drawing
			ensurePlayerDefaults(player);

			// Use boat frame count if in boat, otherwise use player sprite frame count
			let frameAmount;
			if (player.inBoat) {
				frameAmount = boatSprite.frameCount;
			} else {
				const sprite = playerImages[player.action];
				if (!sprite) continue;
				frameAmount = sprite[1];
			}

			if (player.inBoat) {
				// Boat animation - only animate if moving (action is "walk")
				if (player.action === "walk") {
					player.frameTimer += deltaTime * 1000;
					let loopTime = 500; // Slower boat animation
					const frameDelay = loopTime / frameAmount;

					if (player.frameTimer >= frameDelay) {
						player.frameTimer = 0;
						player.frameIndex = (player.frameIndex + 1) % frameAmount;
					}
				} else {
					// When idle in boat, stay on frame 0
					player.frameIndex = 0;
					player.frameTimer = 0;
				}
			} else if (player.action === "idle") {
				player.frameIndex = 0;
				player.frameTimer = 0;
				if (player.direction === "up") {
					frameAmount = 4;
				}
			} else if (player.action === "attack") {
				// Attack animation - cycle through frames
				player.frameTimer += deltaTime * 1000;
				const frameDelay = 100;

				if (player.frameTimer >= frameDelay) {
					player.frameTimer = 0;
					player.frameIndex = (player.frameIndex + 1) % 8; // Loop through 8 frames
				}
			} else {
				player.frameTimer += deltaTime * 1000;
				let loopTime = 600; // Faster animation (was 1200)
				const frameDelay = loopTime / frameAmount;

				if (player.frameTimer >= frameDelay) {
					player.frameTimer = 0;
					player.frameIndex = (player.frameIndex + 1) % frameAmount;
				}
			}

			const sprite = playerImages[player.action];
			drawPlayer(player, false, currentPlayer, sprite);
		}

		//Draw objects(only nearby ones)
		for (const id of nearbyCache.objects) {
			const object = objects[id];
			if (object) {
				drawObject(object, currentPlayer);
			}
		}

		//Draw enemies
		for (const id of nearbyCache.enemies) {
			const enemy = enemies[id];
			if (!enemy) continue;
			
			const sprite = getEnemySprite(enemy);
			
			if (sprite) {
				drawEnemy(enemy, currentPlayer, sprite);
			}
		}

		//Draw drops (only nearby ones)
		for (const id of nearbyCache.drops) {
			const drop = drops[id];
			if (drop) {
				drawDrop(drop, currentPlayer);
			}
		}

		//Draw current player
		if (players[playerId]) {
			const player = players[playerId];

			// Initialize defaults ONLY if truly undefined (not 0)
			if (player.action === undefined) player.action = "idle";
			if (player.direction === undefined) player.direction = "down";
			if (player.frameIndex === undefined) player.frameIndex = 0;
			if (player.frameTimer === undefined) player.frameTimer = 0;
			if (player.inBoat === undefined) player.inBoat = false;

			// Check if attack timer has expired
			if (player.action === "attack" && player.attackEndTime && Date.now() >= player.attackEndTime) {
				// Check if any movement keys are still held
				if (keysHeld.up || keysHeld.down || keysHeld.left || keysHeld.right) {
					player.action = "walk";
					// Set direction based on which key is held
					if (keysHeld.up) player.direction = "up";
					else if (keysHeld.down) player.direction = "down";
					else if (keysHeld.left) player.direction = "left";
					else if (keysHeld.right) player.direction = "right";
				} else {
					player.action = "idle";
				}
				player.frameIndex = 0;
				player.frameTimer = 0;
				player.attackEndTime = null;
			}

			// Use boat frame count if in boat, otherwise use player sprite frame count
			let frameAmount;
			if (player.inBoat) {
				frameAmount = boatSprite.frameCount;
			} else {
				const sprite = playerImages[player.action];
				if (!sprite) return;
				frameAmount = sprite[1];
			}

			if (player.inBoat) {
				// Boat animation - only animate if moving (action is "walk")
				if (player.action === "walk") {
					player.frameTimer += deltaTime * 1000;
					let loopTime = 800; // Slower boat animation
					const frameDelay = loopTime / frameAmount;

					if (player.frameTimer >= frameDelay) {
						player.frameTimer = 0;
						player.frameIndex = (player.frameIndex + 1) % frameAmount;
					}
				} else {
					// When idle in boat, stay on frame 0
					player.frameIndex = 0;
					player.frameTimer = 0;
				}
			} else if (player.action === "idle") {
				// For idle, keep frame at 0 (still frame)
				player.frameIndex = 0;
				player.frameTimer = 0;
			} else if (player.action === "attack") {
				// Attack animation - cycle through frames
				player.frameTimer += deltaTime * 1000;
				const frameDelay = 100;

				if (player.frameTimer >= frameDelay) {
					player.frameTimer = 0;
					player.frameIndex = (player.frameIndex + 1) % 8; // Loop through 8 frames
				}
			} else {
				// For other animated actions (walk, etc.), cycle through frames
				player.frameTimer += deltaTime * 1000;
				const frameDelay = 100;

				if (player.frameTimer >= frameDelay) {
					player.frameTimer = 0;
					player.frameIndex = (player.frameIndex + 1) % frameAmount;
				}
			}

			const sprite = playerImages[player.action];
			drawPlayer(currentPlayer, true, currentPlayer, sprite);
		}

		// Check if player has moved too far from shop/sell inventory
		if ((inShopInventory || inSellInventory) && shopPosition && players[playerId]) {
			const currentPos = [players[playerId].mapX, players[playerId].mapY];
			const shopPos = [shopPosition.mapX, shopPosition.mapY];

			if (!isNearby(currentPos, shopPos)) {
				// Player moved too far, close shop/sell inventory
				if (inShopInventory) {
					shopInventory = {};
					inShopInventory = false;
				}
				if (inSellInventory) {
					inSellInventory = false;
				}
				shopPosition = null;
			}
		}

		//Draw UI elements
		if (inInventory) {
			drawInventory(inventory, "Inventory");
		} else if (inSellInventory) {
			drawInventory(inventory, "Sell Items");
		} else if (inShopInventory) {
			drawShopInventory(shopInventory, players[playerId].speed, players[playerId].damage, players[playerId].maxHealth, shopName);
		}

		drawHUD(players[playerId])

		// Draw chat box or toggle button
		let chatCloseButton = null;
		let chatToggleButton = null;
		let mobileChatBox = null;
		if (isMobile) {
			// Always show mobile chat box
			mobileChatBox = drawMobileChatBox(globalChatMessages, isTyping, inputString);
			chatBoxBounds = mobileChatBox; // Store for touch detection

			// Draw on-screen keyboard if visible
			if (mobileKeyboardVisible) {
				mobileKeyboardData = drawMobileKeyboard(true);
			}
		} else {
			// Desktop: toggle between chat and button
			if (chatBoxVisible) {
				chatCloseButton = drawChatBox(globalChatMessages, isTyping, inputString);
			} else {
				chatToggleButton = drawChatToggleButton();
			}
		}

		// Draw pickup notifications
		drawPickupNotifications(pickupNotifications)

		// Draw and handle mobile controls
		if (isMobile && playerId && players[playerId]) {
			const buttonSize = 80;
			const buttonGap = 15;
			const edgeMargin = 20;

			// Movement buttons (bottom left)
			const upButton = { x: edgeMargin + buttonSize + buttonGap, y: canvas.height - edgeMargin - buttonSize * 2 - buttonGap };
			const downButton = { x: edgeMargin + buttonSize + buttonGap, y: canvas.height - edgeMargin - buttonSize };
			const leftButton = { x: edgeMargin, y: canvas.height - edgeMargin - buttonSize };
			const rightButton = { x: edgeMargin + (buttonSize + buttonGap) * 2, y: canvas.height - edgeMargin - buttonSize };

			// Action buttons (bottom right)
			const attackButton = { x: canvas.width - edgeMargin - buttonSize * 2 - buttonGap, y: canvas.height - edgeMargin - buttonSize };
			const interactButton = { x: canvas.width - edgeMargin - buttonSize, y: canvas.height - edgeMargin - buttonSize };

			// Inventory button (top left, below HUD which is ~120px tall)
			const inventoryButton = { x: edgeMargin, y: 175 };

			const mobileButtons = {
				up: { ...upButton, width: buttonSize, height: buttonSize, key: "up", direction: "up", action: "walk" },
				down: { ...downButton, width: buttonSize, height: buttonSize, key: "down", direction: "down", action: "walk" },
				left: { ...leftButton, width: buttonSize, height: buttonSize, key: "left", direction: "left", action: "walk" },
				right: { ...rightButton, width: buttonSize, height: buttonSize, key: "right", direction: "right", action: "walk" },
				attack: { ...attackButton, width: buttonSize, height: buttonSize, key: "attack", direction: "current", action: "attack" },
				interact: { ...interactButton, width: buttonSize, height: buttonSize, key: "interact", direction: "current", action: "idle" },
				inventory: { ...inventoryButton, width: buttonSize, height: buttonSize, key: "inventory", direction: "current", action: "idle" }
			};

			// Check which buttons are being touched (skip if keyboard is visible)
			const touchedButtons = new Set();
			let touchingAnyButton = false;
			if (!mobileKeyboardVisible) {
				for (const [touchId, touchPos] of activeTouches) {
					for (const [btnName, btn] of Object.entries(mobileButtons)) {
						if (touchPos.x >= btn.x && touchPos.x <= btn.x + btn.width &&
						    touchPos.y >= btn.y && touchPos.y <= btn.y + btn.height) {
							touchedButtons.add(btnName);
							touchingAnyButton = true;
						}
					}
				}
			}

			// If not touching any mobile button, allow UI clicks (but not continuously)
			// Only set mouseLeftClicked once when touch first starts, not every frame
			if (!touchingAnyButton && activeTouches.size > 0 && !lastTouchWasButton) {
				// Don't set mouseLeftClicked here - let touchend handle it
			} else if (touchingAnyButton) {
				// Touching a mobile button, don't trigger UI clicks
				lastTouchWasButton = true;
			}

			// Process button touches
			const player = players[playerId];
			for (const [btnName, btn] of Object.entries(mobileButtons)) {
				const isTouched = touchedButtons.has(btnName);
				const wasHeld = keysHeld[btn.key];

				if (isTouched && !wasHeld) {
					// Button just pressed
					keysHeld[btn.key] = true;

					// Close shop/sell inventory when any mobile button is pressed (except inventory button)
					if (btn.key !== "inventory") {
						if (inShopInventory) {
							shopInventory = {};
							inShopInventory = false;
							shopPosition = null;
						} else if (inSellInventory) {
							inSellInventory = false;
							shopPosition = null;
						}
					}

					// Handle inventory button specially (don't send to server)
					if (btn.key === "inventory") {
						inInventory = !inInventory;
					} else {
						socket.send(JSON.stringify({
							type: "keydown",
							dir: btn.key,
							pressed: true,
							playerID: userId
						}));

						if (btn.key === "attack") {
							if (player.action !== "attack" && (!player.attackEndTime || Date.now() >= player.attackEndTime)) {
								player.action = "attack";
								player.frameIndex = 0;
								player.frameTimer = 0;
								player.attackEndTime = Date.now() + 400;
							}
						} else if (btn.key !== "interact") {
							player.action = btn.action;
							if (btn.direction !== "current") {
								player.direction = btn.direction;
							}

							// Client-side prediction for movement
							if (btn.key === "up" || btn.key === "down" || btn.key === "left" || btn.key === "right") {
								const speed = player.speed || 1;
								switch(btn.key) {
									case "up":
										predictedPosition.targetY -= TILE_SIZE * speed;
										predictedPosition.mapY = Math.round(predictedPosition.targetY / TILE_SIZE);
										break;
									case "down":
										predictedPosition.targetY += TILE_SIZE * speed;
										predictedPosition.mapY = Math.round(predictedPosition.targetY / TILE_SIZE);
										break;
									case "left":
										predictedPosition.targetX -= TILE_SIZE * speed;
										predictedPosition.mapX = Math.round(predictedPosition.targetX / TILE_SIZE);
										break;
									case "right":
										predictedPosition.targetX += TILE_SIZE * speed;
										predictedPosition.mapX = Math.round(predictedPosition.targetX / TILE_SIZE);
										break;
								}
							}
						}
					}
				} else if (!isTouched && wasHeld) {
					// Button just released
					keysHeld[btn.key] = false;

					// Don't send server message for inventory button
					if (btn.key !== "inventory") {
						socket.send(JSON.stringify({
							type: "keydown",
							dir: btn.key,
							pressed: false,
							playerID: userId
						}));

						if (btn.key !== "attack" && btn.key !== "interact") {
							// Update player action based on remaining held keys
							if (!keysHeld.up && !keysHeld.down && !keysHeld.left && !keysHeld.right) {
								player.action = "idle";
							}
						}
					}
				}
			}

			// Draw mobile buttons (hide controls/attack/interact when keyboard is visible)
			const drawMobileButton = (btn, label, color = "rgba(255, 255, 255, 0.3)", btnName, width = buttonSize, height = buttonSize) => {
				const isTouched = touchedButtons.has(btnName);
				ctx.fillStyle = isTouched ? "rgba(255, 255, 255, 0.6)" : color;
				ctx.fillRect(btn.x, btn.y, width, height);
				ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
				ctx.lineWidth = 2;
				ctx.strokeRect(btn.x, btn.y, width, height);
				ctx.fillStyle = "white";
				ctx.font = "bold 20px Arial";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(label, btn.x + width / 2, btn.y + height / 2);
			};

			if (!mobileKeyboardVisible) {
				// Show all buttons when keyboard is closed
				drawMobileButton(upButton, "↑", "rgba(255, 255, 255, 0.3)", "up");
				drawMobileButton(downButton, "↓", "rgba(255, 255, 255, 0.3)", "down");
				drawMobileButton(leftButton, "←", "rgba(255, 255, 255, 0.3)", "left");
				drawMobileButton(rightButton, "→", "rgba(255, 255, 255, 0.3)", "right");
				drawMobileButton(attackButton, "⚔", "rgba(220, 53, 69, 0.5)", "attack");
				drawMobileButton(interactButton, "E", "rgba(53, 152, 220, 0.5)", "interact");
				drawMobileButton(inventoryButton, "I", inInventory ? "rgba(255, 193, 7, 0.8)" : "rgba(255, 193, 7, 0.5)", "inventory");
			} else {
				// Only show inventory button when keyboard is open
				drawMobileButton(inventoryButton, "I", inInventory ? "rgba(255, 193, 7, 0.8)" : "rgba(255, 193, 7, 0.5)", "inventory");
			}
		}

		// Draw minimap
		const minimapButtons = drawMinimap(players[playerId], minimapImage, minimapVisible, isMobile);

		// Draw controls menu (after chat and minimap so overlay covers them)
		let logoutButton = null;
		if (inControlsMenu) {
			// Draw semi-transparent overlay over everything
			ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Draw controls image in center with background
			if (controlsImage.complete) {
				const imgWidth = controlsImage.width;
				const imgHeight = controlsImage.height;
				const padding = 30;
				const bgWidth = imgWidth + padding * 2;
				const bgHeight = imgHeight + padding * 2;
				const bgX = (canvas.width - bgWidth) / 2;
				const bgY = (canvas.height - bgHeight) / 2;
				const imgX = (canvas.width - imgWidth) / 2;
				const imgY = (canvas.height - imgHeight) / 2;

				// Draw semi-transparent black background rectangle (like inventory)
				ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
				ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

				// Draw border
				ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
				ctx.lineWidth = 3;
				ctx.strokeRect(bgX, bgY, bgWidth, bgHeight);

				// Draw controls image with brightness filter (only affects non-transparent pixels)
				ctx.filter = "brightness(1.8) contrast(1.1)";
				ctx.drawImage(controlsImage, imgX, imgY);
				ctx.filter = "none"; // Reset filter
			}

			// Draw logout button in top left (bigger size)
			const buttonWidth = 150;
			const buttonHeight = 50;
			const buttonX = 20;
			const buttonY = 20;

			// Button background
			ctx.fillStyle = "rgba(220, 53, 69, 0.9)";
			ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

			// Button border
			ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
			ctx.lineWidth = 2;
			ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

			// Button text
			ctx.fillStyle = "white";
			ctx.font = "bold 18px Arial";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("Logout", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

			logoutButton = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
		}

		if (mouseLeftClicked) {
			//Handle logout button click
			if (logoutButton && inControlsMenu) {
				if (mouseLeftX >= logoutButton.x &&
					mouseLeftX <= logoutButton.x + logoutButton.width &&
					mouseLeftY >= logoutButton.y &&
					mouseLeftY <= logoutButton.y + logoutButton.height) {
					// Redirect to login page
					window.location.href = "/";
					mouseLeftClicked = false;
				}
			}

			//Handle chat close button click
			if (chatCloseButton && chatBoxVisible) {
				if (mouseLeftX >= chatCloseButton.closeButtonX &&
					mouseLeftX <= chatCloseButton.closeButtonX + chatCloseButton.closeButtonSize &&
					mouseLeftY >= chatCloseButton.closeButtonY &&
					mouseLeftY <= chatCloseButton.closeButtonY + chatCloseButton.closeButtonSize) {
					chatBoxVisible = false;
					mouseLeftClicked = false;
				}
			}

			//Handle chat toggle button click
			if (chatToggleButton && !chatBoxVisible) {
				if (mouseLeftX >= chatToggleButton.buttonX &&
					mouseLeftX <= chatToggleButton.buttonX + chatToggleButton.buttonSize &&
					mouseLeftY >= chatToggleButton.buttonY &&
					mouseLeftY <= chatToggleButton.buttonY + chatToggleButton.buttonSize) {
					chatBoxVisible = true;
					mouseLeftClicked = false;
				}
			}

			//Handle minimap close button click
			if (minimapButtons && minimapVisible && minimapButtons.closeButtonX) {
				if (mouseLeftX >= minimapButtons.closeButtonX &&
					mouseLeftX <= minimapButtons.closeButtonX + minimapButtons.closeButtonSize &&
					mouseLeftY >= minimapButtons.closeButtonY &&
					mouseLeftY <= minimapButtons.closeButtonY + minimapButtons.closeButtonSize) {
					minimapVisible = false;
					mouseLeftClicked = false;
				}
			}

			//Handle minimap toggle button click
			if (minimapButtons && !minimapVisible && minimapButtons.toggleButtonX) {
				if (mouseLeftX >= minimapButtons.toggleButtonX &&
					mouseLeftX <= minimapButtons.toggleButtonX + minimapButtons.toggleButtonSize &&
					mouseLeftY >= minimapButtons.toggleButtonY &&
					mouseLeftY <= minimapButtons.toggleButtonY + minimapButtons.toggleButtonSize) {
					minimapVisible = true;
					mouseLeftClicked = false;
				}
			}

			//Handle inventory item clicks (delete X or consume item) - Desktop only
			if (!isMobile && mouseLeftClicked && inInventory && !inShopInventory && !inSellInventory) {
				const deleteButtonSize = 28;
				let clickedDeleteButton = false;

				// First check if clicking on any delete button
				for (const item in inventory) {
					const currentItem = inventory[item];
					if (currentItem.itemAmount > 0) {
						const deleteButtonX = currentItem.xPosition + 80 - deleteButtonSize;
						const deleteButtonY = currentItem.yPosition;

						if (mouseLeftX >= deleteButtonX && mouseLeftX <= deleteButtonX + deleteButtonSize &&
							mouseLeftY >= deleteButtonY && mouseLeftY <= deleteButtonY + deleteButtonSize) {
							// Clicked on delete button - drop item
							socket.send(JSON.stringify({
								type: "keydown",
								dir: "deleteItem",
								pressed: true,
								playerID: userId,
								item: currentItem.itemName
							}));
							clickedDeleteButton = true;
							mouseLeftClicked = false;
							break;
						}
					}
				}

				// If didn't click delete button, check for item consumption
				if (!clickedDeleteButton && mouseLeftClicked) {
					for (const item in inventory) {
						const currentItem = inventory[item];
						// Check if clicking on the item body (excluding the delete button area)
						const deleteButtonX = currentItem.xPosition + 80 - deleteButtonSize;

						if (mouseLeftX >= currentItem.xPosition && mouseLeftX < deleteButtonX &&
							mouseLeftY >= currentItem.yPosition && mouseLeftY <= currentItem.yPosition + 80) {
							if (currentItem.itemAmount > 0) {
								// Clicked on item body - consume item
								socket.send(JSON.stringify({
									type: "keydown",
									dir: "consumeItem",
									pressed: true,
									playerID: userId,
									item: currentItem.itemName
								}));
								mouseLeftClicked = false;
								break;
							}
						}
					}
				}
			}

			//Handle shop/sell inventory clicks - Desktop only
			if (!isMobile && mouseLeftClicked && inShopInventory) {
				for (const item in shopInventory) {
					const currentItem = shopInventory[item];
					if (mouseLeftX >= currentItem.xPosition && mouseLeftX <= currentItem.xPosition + 80 &&
						mouseLeftY >= currentItem.yPosition && mouseLeftY <= currentItem.yPosition + 80) {
						selectedItem = currentItem;

						// Check if upgrade is already maxed before sending request
						const player = players[playerId];
						const isMaxed = (selectedItem.itemName === "Speed Upgrade" && player.speed >= 10) ||
						                (selectedItem.itemName === "Health Upgrade" && player.maxHealth >= 1000) ||
						                (selectedItem.itemName === "Sword Upgrade" && player.damage >= 50);

						if (!isMaxed) {
							socket.send(JSON.stringify({
								type: "keydown",
								dir: "buyItem",
								pressed: true,
								playerID: userId,
								item: selectedItem.itemName
							}));
						}
						break;
					}
				}
				mouseLeftClicked = false;
			} else if (!isMobile && mouseLeftClicked && inSellInventory) {
				for (const item in inventory) {
					const currentItem = inventory[item];
					if (mouseLeftX >= currentItem.xPosition && mouseLeftX <= currentItem.xPosition + 80 &&
						mouseLeftY >= currentItem.yPosition && mouseLeftY <= currentItem.yPosition + 80) {
						selectedItem = currentItem;
						socket.send(JSON.stringify({
							type: "keydown",
							dir: "sellItem",
							pressed: true,
							playerID: userId,
							item: selectedItem.itemName
						}));
						break;
					}
				}
				mouseLeftClicked = false;
			}
		}

		//Draw delete X on all inventory items (desktop only - mobile uses hold to drop)
		if (!isMobile && inInventory && !inShopInventory && !inSellInventory) {
			const deleteButtonSize = 28;

			for (const item in inventory) {
				const currentItem = inventory[item];
				if (currentItem.itemAmount > 0) {
					const deleteButtonX = currentItem.xPosition + 80 - deleteButtonSize;
					const deleteButtonY = currentItem.yPosition;

					// Draw red background
					ctx.fillStyle = "rgba(220, 53, 69, 0.9)";
					ctx.fillRect(deleteButtonX, deleteButtonY, deleteButtonSize, deleteButtonSize);

					// Draw border
					ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
					ctx.lineWidth = 2;
					ctx.strokeRect(deleteButtonX, deleteButtonY, deleteButtonSize, deleteButtonSize);

					// Draw black X
					ctx.strokeStyle = "black";
					ctx.lineWidth = 3;
					const padding = 6;
					ctx.beginPath();
					// First diagonal
					ctx.moveTo(deleteButtonX + padding, deleteButtonY + padding);
					ctx.lineTo(deleteButtonX + deleteButtonSize - padding, deleteButtonY + deleteButtonSize - padding);
					// Second diagonal
					ctx.moveTo(deleteButtonX + deleteButtonSize - padding, deleteButtonY + padding);
					ctx.lineTo(deleteButtonX + padding, deleteButtonY + deleteButtonSize - padding);
					ctx.stroke();
				}
			}
		}

		requestAnimationFrame(draw);
	}

	loadImages(() => {
		requestAnimationFrame(draw);
	});
}