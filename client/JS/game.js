import { loadImages, sprites } from "./images.js";
import { drawMap, drawPlayer, drawEnemy, drawDrop, drawObject, drawInventory, isNearby } from "./functions.js"

export function startGame({ userId, token }) {
	//const socket = new WebSocket("wss://ws.zombieisland.online/"); //Remotee server
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

	let selectedItem = null;   // <- Track the item for the popup
	let itemMenuOpen = false;

	const rect = canvas.getBoundingClientRect();

	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	canvas.addEventListener('contextmenu', (e) => {

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

		if ("init" === msg.type) { //Initial game setup
			playerId = msg.id;
			players = msg.players;
			for (const id in players) {
				const player = players[id];
				player.pixelX = Number(player.pixelX) || Number(player.mapX || 42) * TILE_SIZE;
				player.pixelY = Number(player.pixelY) || Number(player.mapY || 46) * TILE_SIZE;
				player.targetX = Number(player.targetX) || player.pixelX;
				player.targetY = Number(player.targetY) || player.pixelY;
			}

		} else if ("join" === msg.type) { //New player joined
			players[msg.player.id] = msg.player;
			const player = players[msg.player.id];
			if (!player.pixelX) player.pixelX = player.mapX * TILE_SIZE;
			if (!player.pixelY) player.pixelY = player.mapY * TILE_SIZE;
			if (!player.targetX) player.targetX = player.pixelX;
			if (!player.targetY) player.targetY = player.pixelY;


		} else if ("update" === msg.type) { //Player update
			if (!players[msg.id]) {
				return;
			} //Skip if invalid player
			const player = players[msg.id];
			if (msg.id !== playerId && isNearby([players[playerId].mapX, players[playerId].mapY], [msg.mapX, msg.mapY])) {
				if (undefined != player.health) player.health = Number(msg.health);
				if (undefined != player.mapX) player.mapX = Number(msg.mapX);
				if (undefined != player.mapY) player.mapY = Number(msg.mapY);
				if (undefined != player.pixelX) player.pixelX = Number(msg.pixelX) || (player.mapX * TILE_SIZE) + (Math.floor(TILE_SIZE / 2));
				if (undefined != player.pixelY) player.pixelY = Number(msg.pixelY) || (player.mapY * TILE_SIZE) + (Math.floor(TILE_SIZE / 2));
				if (undefined != player.targetX) player.targetX = Number(msg.targetX);
				if (undefined != player.targetY) player.targetY = Number(msg.targetY);
				if (undefined != player.username) player.username = msg.username;
				if (undefined != player.level) player.level = msg.level;
				if (undefined != player.gold) player.gold = msg.gold;
				if (undefined != player.messages) player.messages = msg.messages;
			}

			if (msg.id === playerId && msg.map) {
				if (undefined != player.health) player.health = Number(msg.health);
				if (undefined != player.mapX) player.mapX = Number(msg.mapX);
				if (undefined != player.mapY) player.mapY = Number(msg.mapY);
				if (undefined != player.pixelX) player.pixelX = Number(msg.pixelX) || (player.mapX * TILE_SIZE) + (Math.floor(TILE_SIZE / 2));
				if (undefined != player.pixelY) player.pixelY = Number(msg.pixelY) || (player.mapY * TILE_SIZE) + (Math.floor(TILE_SIZE / 2));
				if (undefined != player.targetX) player.targetX = Number(msg.targetX);
				if (undefined != player.targetY) player.targetY = Number(msg.targetY);
				if (undefined != player.username) player.username = msg.username;
				if (undefined != player.level) player.level = msg.level;
				if (undefined != player.gold) player.gold = msg.gold;
				if (undefined != player.map) player.map = msg.map;
				if (undefined != player.messages) player.messages = msg.messages;
				inventory = msg.inventory;
			}

		} else if ("enemy" === msg.type) { //enemy update
			if (isNearby([players[playerId].mapX, players[playerId].mapY], [msg.mapX, msg.mapY])) {
				if (!enemies[msg.id]) { //New 
					let enemy = {};

					if (undefined != msg.mapX) enemy.mapX = msg.mapX;
					if (undefined != msg.mapY) enemy.mapY = msg.mapY;
					if (undefined != msg.pixelX) enemy.pixelX = msg.pixelX;
					if (undefined != msg.pixelY) enemy.pixelY = msg.pixelY;
					if (undefined != msg.targetX) enemy.targetX = msg.targetX;
					if (undefined != msg.targetY) enemy.targetY = msg.targetY;
					if (undefined != msg.health) enemy.health = msg.health;
					if (undefined != msg.maxHealth) enemy.maxHealth = msg.maxHealth;
					if (undefined != msg.name) enemy.name = msg.name;
					if (undefined != msg.level) enemy.level = msg.level;
					if (undefined != msg.direction) enemy.direction = msg.direction;
					if (undefined != msg.action) enemy.action = msg.action;
					enemy.frameIndex = enemy.frameIndex ?? 0;
					enemy.frameTimer = enemy.frameTimer ?? 0;
					enemies[msg.id] = enemy;

				} else { //Existing enemy
					const enemy = enemies[msg.id];

					if (undefined != msg.mapX) enemy.mapX = msg.mapX;
					if (undefined != msg.mapY) enemy.mapY = msg.mapY;
					if (undefined != msg.pixelX) enemy.pixelX = msg.pixelX;
					if (undefined != msg.pixelY) enemy.pixelY = msg.pixelY;
					if (undefined != msg.targetX) enemy.targetX = msg.targetX;
					if (undefined != msg.targetY) enemy.targetY = msg.targetY;
					if (undefined != msg.health) enemy.health = msg.health;
					if (undefined != msg.maxHealth) enemy.maxHealth = msg.maxHealth;
					if (undefined != msg.name) enemy.name = msg.name;
					if (undefined != msg.level) enemy.level = msg.level;
					if (undefined != msg.direction) enemy.direction = msg.direction;
					if (undefined != msg.action) enemy.action = msg.action;
					enemy.frameIndex = enemy.frameIndex ?? 0;
					enemy.frameTimer = enemy.frameTimer ?? 0;
				}
			}

		} else if ("drop" === msg.type) {
			if (isNearby([msg.mapX, msg.mapY], [players[playerId].mapX, players[playerId].mapY])) {
				if (!drops[msg.id]) { //New drop
					let drop = {}

					if (undefined != msg.mapX) { drop.mapX = msg.mapX };
					if (undefined != msg.mapY) { drop.mapY = msg.mapY };
					if (undefined != msg.pixelX) { drop.pixelX = msg.pixelX };
					if (undefined != msg.pixelY) { drop.pixelY = msg.pixelY };

					drops[msg.id] = drop;
				} else { //Existing drop
					const drop = drops[msg.id];
					if (undefined != msg.mapX) { drop.mapX = msg.mapX };
					if (undefined != msg.mapY) { drop.mapY = msg.mapY };
					if (undefined != msg.pixelX) { drop.pixelX = msg.pixelX };
					if (undefined != msg.pixelY) { drop.pixelY = msg.pixelY };
				}
			}
		} else if ("object" === msg.type) {
			if (isNearby([players[playerId].mapX, players[playerId].mapY], [msg.mapX, msg.mapY])) {
				if (!objects[msg.id]) { //New 
					let object = {};

					if (undefined != msg.mapX) object.mapX = msg.mapX;
					if (undefined != msg.mapY) object.mapY = msg.mapY;
					if (undefined != msg.pixelX) object.pixelX = msg.pixelX;
					if (undefined != msg.pixelY) object.pixelY = msg.pixelY;
					if (undefined != msg.health) object.health = msg.health;
					if (undefined != msg.maxHealth) object.maxHealth = msg.maxHealth;
					if (undefined != msg.name) object.name = msg.name;
					objects[msg.id] = object;

				} else { //Existing object
					const object = objects[msg.id];

					if (undefined != msg.mapX) object.mapX = msg.mapX;
					if (undefined != msg.mapY) object.mapY = msg.mapY;
					if (undefined != msg.pixelX) object.pixelX = msg.pixelX;
					if (undefined != msg.pixelY) object.pixelY = msg.pixelY;
					if (undefined != msg.health) object.health = msg.health;
					if (undefined != msg.maxHealth) object.maxHealth = msg.maxHealth;
					if (undefined != msg.name) object.name = msg.name;
				}
			}
		} else if ("leave" === msg.type) { //Player left
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
		if (key && !isTyping && !(inInventory && "inventory" === key)) {
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

			let sprite;
			let name = enemies[id].name;
			let action = enemies[id].action;
			if (Math.floor(enemies[id].health > 0)) {
				sprite = sprites[`${name}-${action}`]
			} else {
				sprite = sprites[`${name}-death`]
			}

			const frameAmount = sprite[2]

			if (enemy.frameTimer >= frameDelay) {
				enemy.frameTimer = 0;
				enemy.frameIndex = (enemy.frameIndex + 1) % frameAmount; // 10 frames in top row
				console.log(enemy.frameIndex)
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
			let action = enemies[id].action;

			if (Math.floor(enemies[id].health > 0)) {
				sprite = sprites[`${name}-${action}`]
			} else {
				sprite = sprites[`${name}-death`]
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
				if ( //Check if the current item is the one that has been clicked on
					mouseRightX >= currentItem.xPosition && mouseRightX <= currentItem.xPosition + 50 &&
					mouseRightY >= currentItem.yPosition && mouseRightY <= currentItem.yPosition + 50
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

			// Draw delete button
			const deleteButtonX = selectedItem.xPosition + 35
			const deleteButtonY = selectedItem.yPosition - 20;
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