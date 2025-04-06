import { Player } from "/Game/classes/player.js";
import { Camera } from "/Game/classes/camera.js";
import { Drop } from "/Game/classes/drop.js";
import { Weapon } from "/Game/classes/weapon.js";
import { spawnZombies, isOccupied, resetGame, saveProgress } from "./functions.js";
import { map } from "/Game/map.js";

const tileWidth = 40;
const tileHeight = 40;

const tileImages = {
    9: new Image(),
    14: new Image(),
    19: new Image(),
    25: new Image(),
    29: new Image(),
    38: new Image()
};

tileImages[9].src = "/Game/assets/map/cold-grass.png";
tileImages[14].src = "/Game/assets/map/water.png";
tileImages[19].src = "/Game/assets/map/plains-tree.png";
tileImages[25].src = "/Game/assets/map/plains-grass.png";
tileImages[29].src = "/Game/assets/map/sand.png";
tileImages[38].src = "/Game/assets/map/desert-sand.png";

const unpassableTiles = [14, 19]

const zombieImages = {};
const directions = ["up", "up-right", "right", "down-right", "down", "down-left", "left", "up-left"];

directions.forEach(dir => {
    zombieImages[dir] = new Image();
    zombieImages[dir].src = `/Game/assets/zombie/${dir}.png`; 
});

let coordinate = 0; 
let spawnCoordinates = [];
while (coordinate != 1520) {
    coordinate += 40;
    spawnCoordinates.push(coordinate);
}

const currentTime = Date.now;
let frame = 1;
let round = 1;

const camera = new Camera(0, 0, [0, 0], [0, 0], [0, 0], [0, 0])

// Player spawn in tile coordinates
const playerSpawn = [680 * 40, 650 * 40]; // Pixel coordinates for initial position
const playerToPosition = [Math.floor(playerSpawn[0] / 40), Math.floor(playerSpawn[1] / 40)]; // Tile coordinates
const playerFromPosition = [Math.floor(playerSpawn[0] / 40), Math.floor(playerSpawn[1] / 40)]; // Tile coordinates

const images = {
    "up": "/Game/assets/player/walking/up.png", 
    "up-right": "/Game/assets/player/walking/up-right.png",
    "right": "/Game/assets/player/walking/right.png",
    "down-right": "/Game/assets/player/walking/down-right.png",
    "down": "/Game/assets/player/walking/down.png",
    "down-left": "/Game/assets/player/walking/down-left.png",
    "left": "/Game/assets/player/walking/left.png",
    "up-left": "/Game/assets/player/walking/up-left.png"
}
  
const fist = new Weapon("fist", 10, "meelee", 0, "/Game/assets/items/fist.png")
const gun = new Weapon("gun", 5, "range", 500, "/Game/assets/items/gun.png")
const rifle = new Weapon("machine-gun", 2, "range", 100, "/Game/assets/items/rifle.png")

// Create player with pixel position for drawing and tile positions for movement
const player = new Player(
    0, // damage
    100, // health
    0, // timeMoved
    [40, 40], // size
    playerSpawn, // position (in pixels for drawing)
    playerToPosition, // toPosition (in tile coordinates)
    playerFromPosition, // fromPosition (in tile coordinates)
    275, // delayMove
    images,
    "up",
    1,
    [fist, gun, rifle],
    fist,
    50
);

const zombie = []; 
const drops = [];
const projectiles = [];

const controls = {
    65: false, //Left
    87: false, //Up
    68: false, //Right
    83: false, //Down
    32: false, //Attack
    49: false, //Item 1
    50: false, //Item 2
    51: false, //Item 3
    52: false, //Item 4
    53: false, //Item 5
    82: false, //Restart
    81: false //Quit
}; 

window.onload = function() {
    const canvas = document.getElementById("game-canvas");
    
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    camera.screen = [canvas.width, canvas.height];
    
    window.ctx = canvas.getContext("2d");

    window.addEventListener("keydown", function(event) {
        controls[event.keyCode] = true;
    });

    window.addEventListener("keyup", function(event) {
        controls[event.keyCode] = false;
    });

    // Ensure displayGame function exists before calling
    if (typeof displayGame === 'function') {
        requestAnimationFrame(displayGame);
    } else {
        console.error("displayGame function is not defined!");
    }
};

console.log('Canvas element:', document.getElementById('game-canvas'));

spawnZombies(zombie, spawnCoordinates, tileWidth, tileHeight, map, player, unpassableTiles); //Spawn 10 zombies at the start

let locked = false;
let shooting = false;

function displayGame() {
    if (player.health > 0) {
        // Clear the canvas once at the start of each frame
        ctx.clearRect(0, 0, camera.screen[0], camera.screen[1]);

        // Update camera position
        camera.setCamera(player.position[0] + (player.size[0] / 2), player.position[1] + (player.size[1] / 2));

        // Draw map tiles
        const startCol = Math.max(0, Math.floor(-camera.positionX / tileWidth));
        const endCol = Math.min(map[0].length, Math.ceil((camera.screen[0] - camera.positionX) / tileWidth));
        const startRow = Math.max(0, Math.floor(-camera.positionY / tileHeight));
        const endRow = Math.min(map.length, Math.ceil((camera.screen[1] - camera.positionY) / tileHeight));
        
        for (let i = startRow; i < endRow; i++) {
            for (let j = startCol; j < endCol; j++) {
                const x = j * tileWidth;
                const y = i * tileHeight;
                ctx.drawImage(tileImages[map[i][j]], camera.positionX + x, camera.positionY + y);
            }
        }

        // Handle player movement and update position
        if (!player.updatePosition(currentTime())) {
            if (controls[87] && controls[65]) { // up-left
                player.direction = "up-left";
                if (!isOccupied(player, map, zombie, player.toPosition[1] - 1, player.toPosition[0] - 1, unpassableTiles)) {
                    player.toPosition[0] -= 1;
                    player.toPosition[1] -= 1;
                    player.timeMoved = currentTime();
                }
            } else if (controls[87] && controls[68]) { // up-right
                player.direction = "up-right";
                if (!isOccupied(player, map, zombie, player.toPosition[1] - 1, player.toPosition[0] + 1, unpassableTiles)) {
                    player.toPosition[0] += 1;
                    player.toPosition[1] -= 1;
                    player.timeMoved = currentTime();
                }
            } else if (controls[83] && controls[65]) { // down-left
                player.direction = "down-left";
                if (!isOccupied(player, map, zombie, player.toPosition[1] + 1, player.toPosition[0] - 1, unpassableTiles)) {
                    player.toPosition[0] -= 1;
                    player.toPosition[1] += 1;
                    player.timeMoved = currentTime();
                }
            } else if (controls[83] && controls[68]) { // down-right
                player.direction = "down-right";
                if (!isOccupied(player, map, zombie, player.toPosition[1] + 1, player.toPosition[0] + 1, unpassableTiles)) {
                    player.toPosition[0] += 1;
                    player.toPosition[1] += 1;
                    player.timeMoved = currentTime();
                }
            } else if (controls[87]) { // up
                player.direction = "up";
                if (!isOccupied(player, map, zombie, player.toPosition[1] - 1, player.toPosition[0], unpassableTiles)) {
                    player.toPosition[1] -= 1;
                    player.timeMoved = currentTime();
                }
            } else if (controls[83]) { // down
                player.direction = "down";
                if (!isOccupied(player, map, zombie, player.toPosition[1] + 1, player.toPosition[0], unpassableTiles)) {
                    player.toPosition[1] += 1;
                    player.timeMoved = currentTime();
                }
            } else if (controls[65]) { // left
                player.direction = "left";
                if (!isOccupied(player, map, zombie, player.toPosition[1], player.toPosition[0] - 1, unpassableTiles)) {
                    player.toPosition[0] -= 1;
                    player.timeMoved = currentTime();
                }
            } else if (controls[68]) { // right
                player.direction = "right";
                if (!isOccupied(player, map, zombie, player.toPosition[1], player.toPosition[0] + 1, unpassableTiles)) {
                    player.toPosition[0] += 1;
                    player.timeMoved = currentTime();
                }
            }
        }

        // Update zombie positions from Firebase
        const currentTimeMs = Date.now();
        if (!window.lastZombieUpdate || currentTimeMs - window.lastZombieUpdate >= 100) {
            if (zombie.length < 5) {
                spawnZombies(zombie, spawnCoordinates, tileWidth, tileHeight, map, player, unpassableTiles);
            }
            window.lastZombieUpdate = currentTimeMs;
        }

        // Update and draw zombies
        const now = currentTime();
        for (let i = 0; i < zombie.length; i++) {
            // Update zombie position
            zombie[i].updatePosition(now);

            // Draw zombie sprite
            ctx.drawImage(
                zombieImages[zombie[i].direction],
                Math.round(camera.positionX + zombie[i].position[0]),
                Math.round(camera.positionY + zombie[i].position[1])
            );
            
            // Draw health bar
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(
                Math.round(camera.positionX + zombie[i].position[0] - 5),
                Math.round(camera.positionY + zombie[i].position[1] - 15),
                52, 10
            );
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.fillRect(
                Math.round(camera.positionX + zombie[i].position[0] - 4),
                Math.round(camera.positionY + zombie[i].position[1] - 14),
                Math.round(zombie[i].health) / 2, 8
            );
            
            // Check for damage to player
            if (Math.abs(player.position[0] - zombie[i].position[0]) < 40 && 
                Math.abs(player.position[1] - zombie[i].position[1]) < 40) {
                player.health -= zombie[i].damage;
            }

            // Handle zombie death
            if (zombie[i].health <= 0) {
                let index = zombie.indexOf(zombie[i]);
                if (index > -1) {
                    if (Math.floor(Math.random() * 11) > 7) {
                        drops.push(new Drop(0, 0, 10, "/Game/assets/drops/ammo-drop.png", zombie[i].position, zombie[i].toPosition, false));
                    } else if (Math.floor(Math.random() * 11) > 5) {
                        drops.push(new Drop(10, 0, 0, "/Game/assets/drops/health-drop.png", zombie[i].position, zombie[i].toPosition, false));
                    }
                    zombie.splice(index, 1);
                    player.score += 1;
                }
            }
        }

        // Draw player
        const playerImage = new Image();
        if (frame > 1) {
            let animationImg = Math.floor(frame);
            playerImage.src = "/Game/assets/player/punch-" + player.direction + "/punch" + animationImg.toString() + ".png";
        } else {
            playerImage.src = player.images[player.direction];
        }
        ctx.drawImage(playerImage, Math.round(camera.positionX + player.position[0]), Math.round(camera.positionY + player.position[1]));

        // Draw all game entities in the correct order
        // 1. Draw drops
        for (let i = 0; i < drops.length; i++) {
            const healthImage = new Image();
            healthImage.src = drops[i].image;
            ctx.drawImage(healthImage, camera.positionX + drops[i].position[0], camera.positionY + drops[i].position[1]);
        }

        // 2. Draw projectiles
        for (let i = 0; i < projectiles.length; i++) {
            const projImage = new Image();
            projImage.src = projectiles[i].image;
            ctx.drawImage(projImage, camera.positionX + projectiles[i].position[0] + 20, camera.positionY + projectiles[i].position[1] + 20);
        }

        // 5. Draw UI elements
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.font = "22px joystix";
        ctx.fillText("Score:  " + player.score, 10, 525);
        ctx.fillText("Health: " + Math.round(player.health), 12, 555);

        const hotbarImage = new Image()
        hotbarImage.src = "/Game/assets/game/hotbar.png"
        ctx.drawImage(hotbarImage, 440, 520)

        let indexPosition = 452
        for (let i = 0; i < 5; i++) {
            if (player.inventory[i] == player.weapon) {
                ctx.fillStyle = "rgb(255, 0, 0)"
            } else {
                ctx.fillStyle = "rgb(255, 255, 255)"; 
            }
            ctx.fillText(i + 1, indexPosition, 590) 
            indexPosition += 42
        }

        ctx.font = "10px joystix"
        let itemPosition = 442
        for (let i = 0; i < player.inventory.length; i++) {
            const itemImage = new Image()
            itemImage.src = player.inventory[i].image;
            ctx.drawImage(itemImage, itemPosition, 522)
            if (player.inventory[i].type == "range") {
                if (player.ammo == 0) {
                    ctx.fillStyle = "rgb(255, 0, 0)"
                } else {
                    ctx.fillStyle = "rgb(255, 255, 255)";  
                }
                ctx.fillText(player.ammo, itemPosition + 1, 560)
            }
            itemPosition += 42
        }

        ctx.fillStyle = "rgb(0, 0, 0)"; //Draw player's health bar
        ctx.fillRect(15 - 5, 580 - 15, 202, 30)
        ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.fillRect(15 - 4, 580 - 14, Math.round(player.health) * 2, 28)

    } else {
        ctx.fillStyle = "rgb(255, 255, 255)"; //Draw the game over screen
        ctx.font = "50px joystix";
        ctx.fillText("GAME OVER!", 367, 290)
        ctx.font = "30px joystix";
        ctx.fillText("R-RESTART", 470, 340)
        if (controls[82]) { 
            resetGame(player, round)
        }
    }
    saveProgress(player)
    
    requestAnimationFrame(displayGame);
}
