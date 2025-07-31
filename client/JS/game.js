import { loadImages, sprites } from "./images.js";
import { drawMap, drawPlayer, drawEnemy, drawDrop, drawObject, drawInventory, isNearby } from "./functions.js"

export function startGame({ userId, token }) {
	const socket = new WebSocket("wss://ws.zombieisland.online/");
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

	let selectedItem = null;   // <- Track the item for the popup
	let itemMenuOpen = false;

	canvas.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		const rect = canvas.getBoundingClientRect();
		mouseRightX = e.clientX - rect.left;
		mouseRightY = e.clientY - rect.top;
		console.log(mouseRightX, mouseRightY)
		mouseRightClicked = true;
	});

	canvas.addEventListener('mousedown', (e) => {
		const rect = canvas.getBoundingClientRect();
		mouseLeftX = e.clientX - rect.left;
		mouseLeftY = e.clientY - rect.top;
		console.log(mouseLeftX, mouseLeftY)
		mouseLeftClicked = true;
	});

	let playerId = null; //player ID (not userID)

	let players = {}; //All players
	let enemies = {}; //All enemies
	let drops = {} //All drops
	let objects = {} //All objects

	let inInventory = false;
	let inventory = {};

	let lastFrameTime = performance.now(); //Last frame time
	let frameCount = 0;  //Frames counted
	let lastFpsUpdate = 0; //Last FPS check
	let currentFps = 0;  //Current FPS

	const TARGET_FPS = 60; //Target frames per second
	const FRAME_TIME = 1000 / TARGET_FPS; //Time per frame
	const INTERPOLATION_SPEED = 10.5; //Movement speed

	socket.onmessage = (event) => {
		const msg = JSON.parse(event.data);

		if (msg.type === "init") { //Initial game setup
			playerId = msg.id;
			players = msg.players;
			for (const id in players) {
				const player = players[id];
				player.pixelX = Number(player.pixelX) || Number(player.mapX || 42) * TILE_SIZE;
				player.pixelY = Number(player.pixelY) || Number(player.mapY || 46) * TILE_SIZE;
				player.targetX = Number(player.targetX) || player.pixelX;
				player.targetY = Number(player.targetY) || player.pixelY;
			}

		} else if (msg.type === "join") { //New player joined
			players[msg.player.id] = msg.player;
			const player = players[msg.player.id];
			if (!player.pixelX) player.pixelX = player.mapX * TILE_SIZE;
			if (!player.pixelY) player.pixelY = player.mapY * TILE_SIZE;
			if (!player.targetX) player.targetX = player.pixelX;
			if (!player.targetY) player.targetY = player.pixelY;


		} else if (msg.type === "update") { //Player update
			if (!players[msg.id]) {
				return;
			} //Skip if invalid player
			const player = players[msg.id];
			if (msg.id !== playerId && isNearby([players[playerId].mapX, players[playerId].mapY], [msg.mapX, msg.mapY])) {
				if (player.health !== undefined) player.health = Number(msg.health);
				if (player.mapX !== undefined) player.mapX = Number(msg.mapX);
				if (player.mapY !== undefined) player.mapY = Number(msg.mapY);
				if (player.pixelX !== undefined) player.pixelX = Number(msg.pixelX) || (player.mapX * TILE_SIZE) + (Math.floor(TILE_SIZE / 2));
				if (player.pixelY !== undefined) player.pixelY = Number(msg.pixelY) || (player.mapY * TILE_SIZE) + (Math.floor(TILE_SIZE / 2));
				if (player.targetX !== undefined) player.targetX = Number(msg.targetX);
				if (player.targetY !== undefined) player.targetY = Number(msg.targetY);
				if (player.username !== undefined) player.username = msg.username;
				if (player.level !== undefined) player.level = msg.level;
				if (player.gold !== undefined) player.gold = msg.gold;
				if (player.messages !== undefined) player.messages = msg.messages;
			}

			if (msg.id === playerId && msg.map) {
				if (player.health !== undefined) player.health = Number(msg.health);
				if (player.mapX !== undefined) player.mapX = Number(msg.mapX);
				if (player.mapY !== undefined) player.mapY = Number(msg.mapY);
				if (player.pixelX !== undefined) player.pixelX = Number(msg.pixelX) || (player.mapX * TILE_SIZE) + (Math.floor(TILE_SIZE / 2));
				if (player.pixelY !== undefined) player.pixelY = Number(msg.pixelY) || (player.mapY * TILE_SIZE) + (Math.floor(TILE_SIZE / 2));
				if (player.targetX !== undefined) player.targetX = Number(msg.targetX);
				if (player.targetY !== undefined) player.targetY = Number(msg.targetY);
				if (player.username !== undefined) player.username = msg.username;
				if (player.level !== undefined) player.level = msg.level;
				if (player.gold !== undefined) player.gold = msg.gold;
				if (player.map !== undefined) player.map = msg.map;
				if (player.messages !== undefined) player.messages = msg.messages;
				inventory = msg.inventory;
			}

		} else if (msg.type === "enemy") { //enemy update
			if (isNearby([players[playerId].mapX, players[playerId].mapY], [msg.mapX, msg.mapY])) {
				if (!enemies[msg.id]) { //New 
					let enemy = {};

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
					enemy.frameIndex = enemy.frameIndex ?? 0;
					enemy.frameTimer = enemy.frameTimer ?? 0;
					enemies[msg.id] = enemy;

				} else { //Existing enemy
					const enemy = enemies[msg.id];

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
					enemy.frameIndex = enemy.frameIndex ?? 0;
					enemy.frameTimer = enemy.frameTimer ?? 0;
				}
			}

		} else if (msg.type === "drop") {
			if (isNearby([msg.mapX, msg.mapY], [players[playerId].mapX, players[playerId].mapY])) {
				if (!drops[msg.id]) { //New drop
					let drop = {}

					if (msg.mapX !== undefined) { drop.mapX = msg.mapX };
					if (msg.mapY !== undefined) { drop.mapY = msg.mapY };
					if (msg.pixelX !== undefined) { drop.pixelX = msg.pixelX };
					if (msg.pixelY !== undefined) { drop.pixelY = msg.pixelY };

					drops[msg.id] = drop;
				} else { //Existing drop
					const drop = drops[msg.id];
					if (msg.mapX !== undefined) { drop.mapX = msg.mapX };
					if (msg.mapY !== undefined) { drop.mapY = msg.mapY };
					if (msg.pixelX !== undefined) { drop.pixelX = msg.pixelX };
					if (msg.pixelY !== undefined) { drop.pixelY = msg.pixelY };
				}
			}
		} else if (msg.type === "object") {
			if (isNearby([players[playerId].mapX, players[playerId].mapY], [msg.mapX, msg.mapY])) {
				if (!objects[msg.id]) { //New 
					let object = {};

					if (msg.mapX !== undefined) object.mapX = msg.mapX;
					if (msg.mapY !== undefined) object.mapY = msg.mapY;
					if (msg.pixelX !== undefined) object.pixelX = msg.pixelX;
					if (msg.pixelY !== undefined) object.pixelY = msg.pixelY;
					if (msg.health !== undefined) object.health = msg.health;
					if (msg.maxHealth !== undefined) object.maxHealth = msg.maxHealth;
					if (msg.name !== undefined) object.name = msg.name;
					objects[msg.id] = object;

				} else { //Existing object
					const object = objects[msg.id];

					if (msg.mapX !== undefined) object.mapX = msg.mapX;
					if (msg.mapY !== undefined) object.mapY = msg.mapY;
					if (msg.pixelX !== undefined) object.pixelX = msg.pixelX;
					if (msg.pixelY !== undefined) object.pixelY = msg.pixelY;
					if (msg.health !== undefined) object.health = msg.health;
					if (msg.maxHealth !== undefined) object.maxHealth = msg.maxHealth;
					if (msg.name !== undefined) object.name = msg.name;
				}
			}
		} else if (msg.type === "leave") { //Player left
			delete players[msg.id];
		}
	};

	const keysHeld = {};
	const controls = { //Keybindings
		"w": "up",
		"W": "up",
		"a": "left",
		"A": "left",
		"s": "down",
		"S": "down",
		"d": "right",
		"D": "right",
		" ": "attack",
		"e": "interact",
		"E": "interact",
		"i": "inventory",
		"I": "inventory"
	};

	let isTyping = false;
	let inputString = "";

	window.addEventListener("keydown", (e) => {
		if (!isTyping && e.key === "t") {
			isTyping = true;
			inputString = "";
		} else if (isTyping) {
			if (e.key === "Enter") {
				isTyping = false;
				socket.send(JSON.stringify({
					type: "keydown",
					dir: "message",
					pressed: true,
					playerID: userId,
					message: inputString
				}));
			} else if (e.key === "Escape") {
				isTyping = false;
			} else if (e.key.length === 1) {
				inputString += e.key;
			} else if (e.key === "Backspace") {
				inputString = inputString.slice(0, -1);
			}
		} else if (e.key === "Escape") {
			inInventory = false;
			itemMenuOpen = false;
		} else if (e.key === "i") {
			inInventory = !inInventory;
			itemMenuOpen = false;
		}
	});

	window.addEventListener("keydown", (event) => { //Key pressed
		const key = controls[event.key];
		if (key && !keysHeld[key] && !isTyping) {
			keysHeld[key] = true;
			socket.send(JSON.stringify({
				type: "keydown",
				dir: key,
				pressed: true,
				playerID: userId,
			}));
		}
	});

	window.addEventListener("keyup", (event) => { //Key released
		const key = controls[event.key];
		if (key && !isTyping && !(inInventory && key === "inventory")) {
			keysHeld[key] = false;
			socket.send(JSON.stringify({
				type: "keydown",
				dir: key,
				pressed: false,
				playerID: userId,
			}));
		}
	});

	function tileTransition(start, end, time) { //Smooth movement
		return start + (end - start) * time;
	}


	function draw(currentTime) { //Main game loop
		for (const enemyID in enemies) {
			const enemy = enemies[enemyID];

			if (Math.floor(enemy.health) < 1) {
				delete enemies[enemyID]
			}
		}

		for (const objectID in objects) {
			const object = objects[objectID];

			if (Math.floor(object.health) < 1) {
				delete objects[objectID]
			}
		}

		frameCount++;
		if (currentTime - lastFpsUpdate >= 1000) { //Update FPS counter
			currentFps = frameCount;
			frameCount = 0;
			lastFpsUpdate = currentTime;
		}

		const deltaTime = Math.min(0.1, (currentTime - lastFrameTime) / 1000);
		lastFrameTime = currentTime;

		ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear screen

		if (!playerId || !players[playerId]) { //Skip if not initialized
			requestAnimationFrame(draw);
			return;
		}

		const currentPlayer = players[playerId];
		const time = Math.min(1, deltaTime * INTERPOLATION_SPEED); //Movement smoothing

		for (const id in enemies) { //Delete far away enemies and objects
			const enemy = enemies[id]
			if (!isNearby([currentPlayer.mapX, currentPlayer.mapY], [enemy.mapX, enemy.mapY])) {
				delete enemies[id]
			}
		}

		for (const id in objects) {
			const object = objects[id]
			if (!isNearby([currentPlayer.mapX, currentPlayer.mapY], [object.mapX, object.mapY])) {
				delete objects[id]
			}
		}

		for (const id in players) { //Update player positions
			const player = players[id];
			player.pixelX = tileTransition(player.pixelX, player.targetX, time);
			player.pixelY = tileTransition(player.pixelY, player.targetY, time);
		}

		for (const id in enemies) { //Update enemy positions
			const enemy = enemies[id];
			enemy.pixelX = tileTransition(enemy.pixelX, enemy.targetX, time);
			enemy.pixelY = tileTransition(enemy.pixelY, enemy.targetY, time);
			enemy.frameTimer += deltaTime * 1000; // Convert to ms
			const frameDelay = 100; // ms between frames

			if (enemy.frameTimer >= frameDelay) {
				enemy.frameTimer = 0;
				enemy.frameIndex = (enemy.frameIndex + 1) % 8; // 8 frames in top row
			}
		}

		drawMap(currentPlayer); //Draw surrounding areas

		for (const id in players) { //Draw other players
			if (id !== playerId) {
				drawPlayer(players[id], false, currentPlayer);
			}
		}

		for (const id in objects) { //Draw objects
			drawObject(objects[id], currentPlayer);
		}

		for (const id in enemies) { //Draw enemies
			let sprite;
			let name = enemies[id].name;

			if (name === "Green Slime") {
				sprite = sprites[0];
			} else if (name === "Toxic Slime") {
				sprite = sprites[1];
			} else if (name === "Magma Slime") {
				sprite = sprites[2];
			} else {
				continue;
			}

			drawEnemy(enemies[id], currentPlayer, sprite);
		}

		for (const id in drops) { //Draw drops
			const drop = drops[id]
			drawDrop(drop, currentPlayer); //Remove picked up drops

			for (const playerID in players) {
				const player = players[playerID];
				const dx = Math.abs(player.pixelX - drop.pixelX);
				const dy = Math.abs(player.pixelY - drop.pixelY);
				if (dx < TILE_SIZE - 0.5 && dy < TILE_SIZE - 0.5) { //If drop was picked up
					delete drops[id]
					if (inInventory) { //Provide realtime updates if player picks up an item and is viewing inv
						socket.send(JSON.stringify({
							type: "keydown",
							dir: "inventory",
							pressed: true,
							playerID: userId,
						}));
					}
				}
			}
		}

		if (players[playerId]) { //Draw you (on top)
			drawPlayer(currentPlayer, true, currentPlayer);
		}

		if (inInventory) {
			drawInventory(inventory)
		}

		if (mouseRightClicked) {
			selectedItem = null;
			for (const item in inventory) {
				const currentItem = inventory[item]
				if (
					mouseRightX >= currentItem.xPosition - 10 && mouseRightX <= currentItem.xPosition + 10 &&
					mouseRightY >= currentItem.yPosition - 10 && mouseRightY <= currentItem.yPosition + 10
				) {
					selectedItem = currentItem;
					itemMenuOpen = true;
					break; // Stop after the first match
				}
			}
		}

		// Reset right click so it only triggers once per click
		mouseRightClicked = false;

		if (itemMenuOpen && selectedItem && selectedItem.itemAmount > 0) { //Check if item exists before showing item popup
			// Draw popup text
			ctx.fillStyle = "black";
			ctx.fillText(selectedItem.itemName, selectedItem.xPosition + 70, selectedItem.yPosition);

			// Draw delete button
			const deleteButtonX = selectedItem.xPosition + 70;
			const deleteButtonY = selectedItem.yPosition;
			const deleteButtonWidth = 40;
			const deleteButtonHeight = 40;

			ctx.fillStyle = "red";
			ctx.fillRect(deleteButtonX, deleteButtonY, deleteButtonWidth, deleteButtonHeight);

			if (mouseLeftClicked) { //If user clicks delete button
				if (
					mouseLeftX > deleteButtonX && mouseLeftX < deleteButtonX + deleteButtonWidth &&
					mouseLeftY > deleteButtonY && mouseLeftY < deleteButtonY + deleteButtonHeight
				) {
					selectedItem.itemAmount -= 1
					// Send delete request
					socket.send(JSON.stringify({
						type: "keydown",
						dir: "deleteItem",
						pressed: true,
						playerID: userId,
						item: selectedItem.itemName
					}));
				}
			}
		}

		// Reset left click so it only triggers once per click
		mouseLeftClicked = false;
		
		requestAnimationFrame(draw)
	}

	loadImages(() => { //Start game when images load
		requestAnimationFrame(draw);
	});
}