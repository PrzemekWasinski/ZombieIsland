import { loadImages, sprites, playerImages } from "./images.js";
import { drawMap, drawPlayer, drawEnemy, drawDrop, drawObject, drawInventory, isNearby, drawHUD, drawShopInventory, drawChatBox, drawPickupNotifications, drawChatToggleButton, drawMinimap } from "./functions.js"

export function startGame({ userId, token }) {
	const socket = new WebSocket("wss://ws.zombieisland.online/"); //Main server
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

	let playerId = null; //player ID (not userID)

	let players = {}; //All players
	let enemies = {}; //All enemies
	let drops = {} //All drops
	let objects = {} //All objects

	let inInventory = false;
	let inShopInventory = false;
	let inSellInventory = false;
	let chatBoxVisible = true;
	let minimapVisible = true;

	let shopInventory = {};
	let shopName = "";
	let inventory = {};

	// Load minimap image
	const minimapImage = new Image();
	minimapImage.src = "../assets/HUD/map.png";

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

		} else if ("update" === msg.type) { //Player update
			if (!players[msg.id]) {
				return;
			} //Skip if invalid player
			const player = players[msg.id];

			//Only update if player is nearby OR it's the current player
			if (msg.id === playerId || isNearby([players[playerId].mapX, players[playerId].mapY], [msg.mapX, msg.mapY])) {
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
						player.action = msg.action;
						// Reset frame when action changes
						if (msg.action === "attack") {
							player.frameIndex = 0;
							player.frameTimer = 0;
						}
					}
				}
				if (msg.inBoat !== undefined) player.inBoat = msg.inBoat;
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
			}

		} else if ("dropDelete" === msg.type) {
			// Remove drop from client when picked up
			delete drops[msg.id];

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
			console.log(msg.name)
			console.log(msg.inventory)

			inShopInventory = true;
			shopInventory = msg.inventory;
			shopName = msg.name;

		} else if ("sell" === msg.type) {
			inSellInventory = true;

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

	window.addEventListener("keydown", (e) => {
		if (inShopInventory) {
			shopInventory = {};
			inShopInventory = false;
		} else if (inSellInventory) {
			inSellInventory = false;
		}

		if (!isTyping && e.key === "t") {
			chatBoxVisible = true; // Open chat when starting to type
			isTyping = true;
			inputString = "";
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
			inInventory = false;
		} else if ("i" === e.key) {
			inInventory = !inInventory;
		} 
	});

	window.addEventListener("keydown", (event) => {
		const control = controls[event.key];
		if (!control || isTyping || !playerId || !players[playerId]) return;

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
			player.pixelX = tileTransition(player.pixelX, player.targetX, time);
			player.pixelY = tileTransition(player.pixelY, player.targetY, time);
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

		//Fill water
		ctx.fillStyle = "#4287f5"
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		drawMap(currentPlayer);

		//Draw other players
		for (const id of nearbyCache.players) {
			const player = players[id];
			if (!player) continue;

			//Ensure player has valid defaults before drawing
			ensurePlayerDefaults(player);

			const sprite = playerImages[player.action];
			if (!sprite) continue;

			let frameAmount = sprite[1];

			if (player.action === "idle") {
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

		//Draw drops (server handles pickup and deletion)
		for (const id in drops) {
			const drop = drops[id];
			drawDrop(drop, currentPlayer);
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

			const sprite = playerImages[player.action];
			if (sprite) {
				let frameAmount = sprite[1];

				if (player.action === "idle") {
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
				drawPlayer(currentPlayer, true, currentPlayer, sprite);
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
		if (chatBoxVisible) {
			chatCloseButton = drawChatBox(globalChatMessages, isTyping, inputString);
		} else {
			chatToggleButton = drawChatToggleButton();
		}

		// Draw pickup notifications
		drawPickupNotifications(pickupNotifications)

		// Draw minimap
		const minimapButtons = drawMinimap(players[playerId], minimapImage, minimapVisible);

		if (mouseLeftClicked) {
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

			//Handle inventory item clicks (delete X or consume item)
			if (mouseLeftClicked && inInventory && !inShopInventory && !inSellInventory) {
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

			//Handle shop/sell inventory clicks
			if (mouseLeftClicked && inShopInventory) {
				for (const item in shopInventory) {
					const currentItem = shopInventory[item];
					if (mouseLeftX >= currentItem.xPosition && mouseLeftX <= currentItem.xPosition + 80 &&
						mouseLeftY >= currentItem.yPosition && mouseLeftY <= currentItem.yPosition + 80) {
						selectedItem = currentItem;
						socket.send(JSON.stringify({
							type: "keydown",
							dir: "buyItem",
							pressed: true,
							playerID: userId,
							item: selectedItem.itemName
						}));
						break;
					}
				}
				mouseLeftClicked = false;
			} else if (mouseLeftClicked && inSellInventory) {
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

		//Draw delete X on all inventory items
		if (inInventory && !inShopInventory && !inSellInventory) {
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