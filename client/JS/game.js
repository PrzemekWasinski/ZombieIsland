import { loadImages, sprites, playerImages } from "./images.js";
import { drawMap, drawPlayer, drawEnemy, drawDrop, drawObject, drawInventory, isNearby, drawHUD, drawShopInventory } from "./functions.js"

export function startGame({ userId, token }) {
	//const socket = new WebSocket("wss://ws.zombieisland.online/"); //Main server
	const socket = new WebSocket("ws://localhost:8080"); //Local server

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

	let mouseRightX = 0;
	let mouseRightY = 0;
	let mouseRightClicked = false;

	let mouseLeftX = 0;
	let mouseLeftY = 0;
	let mouseLeftClicked = false;

	let selectedItem = null;   
	let itemMenuOpen = false;

	const rect = canvas.getBoundingClientRect();

	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	canvas.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		mouseRightX = (e.clientX - rect.left) * scaleX;
		mouseRightY = (e.clientY - rect.top) * scaleY;
		mouseRightClicked = true;
	});

	canvas.addEventListener('mousedown', (e) => {
		mouseLeftX = (e.clientX - rect.left) * scaleX;
		mouseLeftY = (e.clientY - rect.top) * scaleY;
		mouseLeftClicked = true;
	});

	let playerId = null; //player ID (not userID)

	let players = {}; //All players
	let enemies = {}; //All enemies
	let drops = {} //All drops
	let objects = {} //All objects

	let inInventory = false;
	let inShopInventory = false;
	let shopInventory = {};
	let inventory = {};

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
		if (!player.frameIndex) player.frameIndex = 0;
		if (!player.frameTimer) player.frameTimer = 0;
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
			if (Math.floor(enemies[enemyID].health) < 1) {
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

		} else if ("update" === msg.type) { //Player update
			if (!players[msg.id]) {
				return;
			} //Skip if invalid player
			const player = players[msg.id];
			
			//Only update if player is nearby OR it's the current player
			if (msg.id === playerId || isNearby([players[playerId].mapX, players[playerId].mapY], [msg.mapX, msg.mapY])) {
				if (msg.health !== undefined) player.health = Number(msg.health);
				if (msg.mapX !== undefined) player.mapX = Number(msg.mapX);
				if (msg.mapY !== undefined) player.mapY = Number(msg.mapY);
				if (msg.pixelX !== undefined) player.pixelX = Number(msg.pixelX);
				if (msg.pixelY !== undefined) player.pixelY = Number(msg.pixelY);
				if (msg.targetX !== undefined) player.targetX = Number(msg.targetX);
				if (msg.targetY !== undefined) player.targetY = Number(msg.targetY);
				if (msg.username !== undefined) player.username = msg.username;
				if (msg.level !== undefined) player.level = msg.level;
				if (msg.gold !== undefined) player.gold = msg.gold;
				if (msg.messages !== undefined) player.messages = msg.messages;

				if (msg.id === playerId) {
					if (msg.map) player.map = msg.map;
					if (msg.inventory) inventory = msg.inventory;
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
						name: msg.name
					};
				} else { //Existing object - direct property assignment
					if (msg.mapX !== undefined) object.mapX = msg.mapX;
					if (msg.mapY !== undefined) object.mapY = msg.mapY;
					if (msg.pixelX !== undefined) object.pixelX = msg.pixelX;
					if (msg.pixelY !== undefined) object.pixelY = msg.pixelY;
					if (msg.health !== undefined) object.health = msg.health;
					if (msg.maxHealth !== undefined) object.maxHealth = msg.maxHealth;
					if (msg.name !== undefined) object.name = msg.name;
				}
				nearbyCache.objects.add(msg.id);
			}

		} else if ("shop" === msg.type) {
			console.log(msg.name)
			console.log(msg.inventory)

			inShopInventory = true;
			shopInventory = msg.inventory;

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
			}

		inShopInventory = !inShopInventory;
		if (!isTyping && e.key === "t") {
			isTyping = true;
			inputString = "";
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
			} else if ("Escape" === e.key) {
				isTyping = false;
			} else if (1 === e.key.length) {
				inputString += e.key;
			} else if ("Backspace" === e.key) {
				inputString = inputString.slice(0, -1);
			}
		} else if ("Escape" === e.key) {
			inInventory = false;
			itemMenuOpen = false;
		} else if ("i" === e.key) {
			inInventory = !inInventory;
			itemMenuOpen = false;
		} 
	});

	window.addEventListener("keydown", (event) => {
		const control = controls[event.key];
		if (!control || isTyping || !playerId || !players[playerId]) return;

		const key = control.key;
		const player = players[playerId];
		player.action = control.action;

		if (control.direction !== "current") {
			player.direction = control.direction;
		}

		if (key && !keysHeld[key]) {
			keysHeld[key] = true;
			socket.send(JSON.stringify({
				type: "keydown",
				dir: key,
				pressed: true,
				playerID: userId,
			}));
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
			if (!nearbyCache.objects.has(id)) {
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
				if (enemy.frameTimer >= frameDelay) {
					enemy.frameTimer = 0;
					enemy.frameIndex = (enemy.frameIndex + 1) % frameAmount;
				}
			}
		}

		//Drawing phase
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
				if (player.direction === "up") {
					frameAmount = 4;
				}
			} else {
				player.frameTimer += deltaTime * 1000;
				let loopTime = 1200;
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

		//Draw drops and check for pickup
		const dropsToDelete = [];
		for (const id in drops) {
			const drop = drops[id];
			drawDrop(drop, currentPlayer);

			//Check if any player picked up the drop
			for (const playerID in players) {
				const player = players[playerID];
				const dx = Math.abs(player.pixelX - drop.pixelX);
				const dy = Math.abs(player.pixelY - drop.pixelY);

				if (dx < TILE_SIZE - 0.5 && dy < TILE_SIZE - 0.5) {
					dropsToDelete.push(id);
					break;
				}
			}
		}
		
		//Batch delete picked up drops
		dropsToDelete.forEach(id => delete drops[id]);

		//Draw current player
		if (players[playerId]) {
			const player = players[playerId];
			ensurePlayerDefaults(player); //Ensure current player has valid defaults
			
			const sprite = playerImages[player.action];
			if (sprite) {
				let frameAmount = sprite[1];


				player.frameTimer += deltaTime * 1000;
				const frameDelay = 100;

				if (player.frameTimer >= frameDelay) {
					player.frameTimer = 0;
					player.frameIndex = (player.frameIndex + 1) % frameAmount;
				}
				drawPlayer(currentPlayer, true, currentPlayer, sprite);
			}
		}

		//Draw UI elements
		if (inInventory) {
			drawInventory(inventory);
		} else if (inShopInventory) {
			drawShopInventory(shopInventory);
		} 
		drawHUD(players[playerId])
		

		//Handle right click for item selection
		if (mouseRightClicked) {
			selectedItem = null;

			if (inInventory) {
				for (const item in inventory) {
					const currentItem = inventory[item];
					if (mouseRightX >= currentItem.xPosition && mouseRightX <= currentItem.xPosition + 50 &&
						mouseRightY >= currentItem.yPosition && mouseRightY <= currentItem.yPosition + 50) {
						selectedItem = currentItem;
						itemMenuOpen = true;
						break;
					}
				}
			} else if (inShopInventory) {
				for (const item in shopInventory) {
					const currentItem = shopInventory[item];
					if (mouseRightX >= currentItem.xPosition && mouseRightX <= currentItem.xPosition + 50 &&
						mouseRightY >= currentItem.yPosition && mouseRightY <= currentItem.yPosition + 50) {
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
			}
			mouseRightClicked = false;
		}

		//Handle item menu
		if (itemMenuOpen && selectedItem && selectedItem.itemAmount > 0) {
			ctx.fillStyle = "black";

			const deleteButtonX = selectedItem.xPosition + 35;
			const deleteButtonY = selectedItem.yPosition - 20;
			const deleteButtonWidth = 40;
			const deleteButtonHeight = 40;

			ctx.fillStyle = "red";
			ctx.fillRect(deleteButtonX, deleteButtonY, deleteButtonWidth, deleteButtonHeight);

			if (mouseLeftClicked) {
				if (mouseLeftX > deleteButtonX && mouseLeftX < deleteButtonX + deleteButtonWidth &&
					mouseLeftY > deleteButtonY && mouseLeftY < deleteButtonY + deleteButtonHeight) {
					selectedItem.itemAmount -= 1;
					socket.send(JSON.stringify({
						type: "keydown",
						dir: "deleteItem",
						pressed: true,
						playerID: userId,
						item: selectedItem.itemName
					}));
				}
				mouseLeftClicked = false;
			}
		}

		requestAnimationFrame(draw);
	}

	loadImages(() => {
		requestAnimationFrame(draw);
	});
}