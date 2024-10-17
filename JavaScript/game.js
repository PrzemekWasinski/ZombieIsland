

const map =  [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
                        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
                        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0],
                        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0],
                        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
                        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

const mapWidth = map[0].length;
const mapHeight = map.length;

const tileWidth = 40;
const tileHeight = 40;

let currentTime = Date.now;
let frame = 0;

class Player {
    constructor(score, health, timeMoved, size, position, fromPosition, toPosition, delayMove, images, direction) {
        this.score = score;
        this.health = health;
        this.timeMoved = timeMoved;
        this.size = size;
        this.position = position;
        this.fromPosition = fromPosition;
        this.toPosition = toPosition;
        this.delayMove = delayMove;
        this.images = images;
        this.direction = direction;
    }

    move(x, y) {
        this.fromPosition = [x, y];
        this.toPosition = [x, y];
        this.position = [((tileWidth * x) + ((tileWidth - this.size[0]) / 2)), ((tileHeight * y) + ((tileHeight - this.size[1]) / 2))];
    }

    updatePosition(time) {
        if (this.fromPosition[0] == this.toPosition[0]) {
            if (this.fromPosition[1] == this.toPosition[1]) {
                return false;
            }
        } 

        if ((time - this.timeMoved) >= this.delayMove) {
            this.move(this.toPosition[0], this.toPosition[1])
        } else {
            this.position[0] = (this.fromPosition[0] * tileWidth) + ((tileWidth - this.size[0]) / 2);
            this.position[1] = (this.fromPosition[1] * tileHeight) + ((tileHeight - this.size[1]) / 2);

            if (this.toPosition[0] != this.fromPosition[0]) {
                let distance = (tileWidth / this.delayMove) * (time - this.timeMoved);
                if (this.toPosition[0] < this.fromPosition[0]) {
                    this.position[0] -= distance;
                } else {
                    this.position[0] += distance;
                }
            }
            if (this.toPosition[1] != this.fromPosition[1]) {
                let distance = (tileHeight / this.delayMove) * (time - this.timeMoved);
                if (this.toPosition[1] < this.fromPosition[1]) {
                    this.position[1] -= distance;
                } else {
                    this.position[1] += distance;
                }
            }
            this.position[0] = Math.round(this.position[0]);
            this.position[1] = Math.round(this.position[1]);
        }
        return true;
    }
}

// player
const playerSpawn = [720, 800];
const playerToPosition = [[playerSpawn[0] / tileWidth, playerSpawn[1] / tileHeight]];
const playerFromPosition = [playerSpawn[0] / tileWidth, playerSpawn[1] / tileHeight];
const images = {"up": "..//assets/player/up.png",
                                "up-right": "..//assets/player/up-right.png",
                                "right": "..//assets/player/right.png",
                                "down-right": "..//assets/player/down-right.png",
                                "down": "..//assets/player/down.png",
                                "down-left": "..//assets/player/down-left.png",
                                "left": "..//assets/player/left.png",
                                "up-left": "..//assets/player/up-left.png",}
                                
const player = new Player(0, 100, 0, [tileWidth, tileHeight], playerSpawn, playerToPosition, playerFromPosition, 275, images, "up");


//zombies
let coordinate = 0;
let spawnCoordinates = [];
while (coordinate != 1520) {
    coordinate += 40;
    spawnCoordinates.push(coordinate);
}

class Zombie {
    constructor(inRange, damage, health, timeMoved, size, position, fromPosition, toPosition, delayMove, images, direction) {
        this.inRange = inRange;
        this.damage = damage;
        this.health = health;
        this.timeMoved = timeMoved;
        this.size = size;
        this.position = position;
        this.fromPosition = fromPosition;
        this.toPosition = toPosition;
        this.delayMove = delayMove;
        this.images = images;
        this.direction = direction;
    }

    move(x, y) {
        this.fromPosition = [x, y];
        this.toPosition = [x, y];
        this.position = [((tileWidth * x) + ((tileWidth - this.size[0]) / 2)), ((tileHeight * y) + ((tileHeight - this.size[1]) / 2))];
    }

    updatePosition(time) {
        if (this.fromPosition[0] == this.toPosition[0]) {
            if (this.fromPosition[1] == this.toPosition[1]) {
                return false;
            }
        } 

        if ((time - this.timeMoved) >= this.delayMove) {
            this.move(this.toPosition[0], this.toPosition[1])
        } else {
            this.position[0] = (this.fromPosition[0] * tileWidth) + ((tileWidth - this.size[0]) / 2);
            this.position[1] = (this.fromPosition[1] * tileHeight) + ((tileHeight - this.size[1]) / 2);

            if (this.toPosition[0] != this.fromPosition[0]) {
                let distance = (tileWidth / this.delayMove) * (time - this.timeMoved);
                if (this.toPosition[0] < this.fromPosition[0]) {
                    this.position[0] -= distance;
                } else {
                    this.position[0] += distance;
                }
            }
            if (this.toPosition[1] != this.fromPosition[1]) {
                let distance = (tileHeight / this.delayMove) * (time - this.timeMoved);
                if (this.toPosition[1] < this.fromPosition[1]) {
                    this.position[1] -= distance;
                } else {
                    this.position[1] += distance;
                }
            } 
            this.position[0] = Math.round(this.position[0]);
            this.position[1] = Math.round(this.position[1]);
        }
        return true;
    }
}

const zombieAmount = 10;
const zombie = [];
for (let i = 0; i < zombieAmount; i++) {
    let spawn = [spawnCoordinates[Math.floor(Math.random() * spawnCoordinates.length)], spawnCoordinates[Math.floor(Math.random() * spawnCoordinates.length)]];
    let zombieFromPosition = [spawn[0] / tileHeight, spawn[1] / tileWidth];
    let zombieToPosition = [spawn[0] / tileHeight, spawn[1] / tileWidth];
    const images = {"up": "..//assets/zombie/up.png",
                                    "up-right": "..//assets/zombie/up-right.png",
                                    "right": "..//assets/zombie/right.png",
                                    "down-right": "..//assets/zombie/down-right.png",
                                    "down": "..//assets/zombie/down.png",
                                    "down-left": "..//assets/zombie/down-left.png",
                                    "left": "..//assets/zombie/left.png",
                                    "up-left": "..//assets/zombie/up-left.png"}

    zombie.push(new Zombie(false, 0.05, 100, 0, [tileWidth, tileHeight], spawn, zombieFromPosition, zombieToPosition, 350, images, "up")) 
}

// camera
const camera = {screen : [0, 0],
                              topLeft : [0, 0],
                              bottomRight : [0, 0],
                              center : [0, 0]};

function setCamera(px, py) {
    camera[0] = Math.floor((camera.screen[0] / 2) - px);
    camera[1] = Math.floor((camera.screen[1] / 2) - py);

    let tile = [Math.floor(px / tileWidth), Math.floor(py / tileHeight)];

    camera.topLeft[0] = tile[0] - 1 - Math.ceil((camera.screen[0] / 2) / tileWidth);
    camera.topLeft[1] = tile[1] - 1 - Math.ceil((camera.screen[1] / 2) / tileHeight);

    if (camera.topLeft[0] < 0) {
        camera.topLeft[0] = 0;
    }

    if (camera.topLeft[1] < 0) {
        camera.topLeft[1] = 0;
    }

    camera.bottomRight[0] = tile[0] + 1 + Math.ceil((camera.screen[0] / 2) / tileWidth);
    camera.bottomRight[1] = tile[1] + 2 + Math.ceil((camera.screen[1] / 2) / tileHeight);

    if (camera.bottomRight[0] >= mapWidth) {
        camera.bottomRight[0] = mapWidth - 1;
    }

    if (camera.bottomRight[1] >= mapHeight) {
        camera.bottomRight[1] = mapHeight - 1;
    }
}

const controls = {37: false, //Left
                               38: false, //Up
                               39: false, //Right
                               40: false, //Down
                               81: false}; //Attack

window.onload = function() {
    camera.screen = [document.getElementById("game").width, document.getElementById("game").height]
    ctx = document.getElementById("game").getContext("2d");
    requestAnimationFrame(displayGame);

    window.addEventListener("keydown", function(event) { // If user presses down a key
        controls[event.keyCode] = true; // Set key down to true
    });
    window.addEventListener("keyup", function(event) { // If user lets go of a key
        controls[event.keyCode] = false; // Set key down to false
    });
}

function isOccupied(x, y) { //Checks if a tile isn't occupied (doesn't have a player / zombie / tree in it)
    if (player.toPosition[0] == y && player.toPosition[1] == x) {
        return true;
    }

    if (map[x][y] == 0) {
        return true;
    }

    for (let i = 0; i < zombie.length; i++) {
        if (zombie[i].toPosition[1] == x && zombie[i].toPosition[0] == y) {
            return true;
        }
    }
    return false;
}

function displayGame() {
    if (player.health >= 0) { 
        for (let i = 0; i < zombie.length; i++) {
            if (!zombie[i].updatePosition(currentTime())) { //movements for zombies
                if (player.position[1] < zombie[i].position[1] && player.position[0] < zombie[i].position[0]) { // up and left
                    zombie[i].direction = "up-left";
                    if (!isOccupied(zombie[i].toPosition[1] - 1, zombie[i].toPosition[0] - 1)) {
                        zombie[i].toPosition[0] -= 1;
                        zombie[i].toPosition[1] -= 1;
                    }
                } else if (player.position[1] < zombie[i].position[1] && player.position[0] > zombie[i].position[0]) { // up and right
                    zombie[i].direction = "up-right";
                    if (!isOccupied(zombie[i].toPosition[1] - 1, zombie[i].toPosition[0] + 1)) {
                        zombie[i].toPosition[0] += 1;
                        zombie[i].toPosition[1] -= 1;
                    }
                } else if (player.position[1] > zombie[i].position[1] && player.position[0] < zombie[i].position[0]) { // down and left
                    zombie[i].direction = "down-left";
                    if (!isOccupied(zombie[i].toPosition[1] + 1, zombie[i].toPosition[0] - 1)) {
                        zombie[i].toPosition[0] -= 1;
                        zombie[i].toPosition[1] += 1;
                    }
                } else if (player.position[1] > zombie[i].position[1] &&  player.position[0] > zombie[i].position[0]) { // down and right
                    zombie[i].direction = "down-right";
                    if (!isOccupied(zombie[i].toPosition[1] + 1, zombie[i].toPosition[0] + 1)) {                            
                        zombie[i].toPosition[0] += 1;
                        zombie[i].toPosition[1] += 1;
                    }
                } else if (player.position[1] < zombie[i].position[1]) { // move up if player is above
                    zombie[i].direction = "up";
                    if (!isOccupied(zombie[i].toPosition[1] - 1, zombie[i].toPosition[0])) {
                        zombie[i].toPosition[1] -= 1;
                    }
                } else if (player.position[1] > zombie[i].position[1]) { // move down if player is below
                    zombie[i].direction = "down";
                    if (!isOccupied(zombie[i].toPosition[1] + 1, zombie[i].toPosition[0])) {
                        zombie[i].toPosition[1] += 1;
                    }
                } else if (player.position[0] < zombie[i].position[0]) { // move left if player is to the right
                    zombie[i].direction = "left";
                    if (!isOccupied(zombie[i].toPosition[1], zombie[i].toPosition[0] - 1)) {
                        zombie[i].toPosition[0] -= 1;
                    }                
                } else if (player.position[0] > zombie[i].position[0]) { // move right if player is to the left
                    zombie[i].direction = "right";
                    if (!isOccupied(zombie[i].toPosition[1], zombie[i].toPosition[0] + 1)) {
                        zombie[i].toPosition[0] += 1;
                    }
                }
                
                if (zombie[i].fromPosition[0] != zombie[i].toPosition[0]) {
                    zombie[i].timeMoved = currentTime();
                } else if (zombie[i].fromPosition[1] != zombie[i].toPosition[1]) {
                    zombie[i].timeMoved = currentTime();
                }
            }

            //collisions
            zombie[i].inRange = false;
            if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1 || //left
                player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] + 1 || //right
                player.toPosition[0] - 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] || //above
                player.toPosition[0] + 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] || //below
                player.toPosition[0] - 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1 || //up-left
                player.toPosition[0] + 1== zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] + 1 || //down-right
                player.toPosition[0] - 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1]  + 1|| //up-right
                player.toPosition[0] + 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1) { //down-left
                zombie[i].inRange = true;
                player.health -= zombie[i].damage;
            }
        }

        if (!player.updatePosition(currentTime())) { //movements for player
            if (controls[38] && controls[37]) { // up and left
                player.direction = "up-left";
                if (!isOccupied(player.toPosition[1] - 1, player.toPosition[0] - 1)) {
                    player.toPosition[0] -= 1;
                    player.toPosition[1] -= 1; 
                }
            } else if (controls[38] && controls[39]) { // up and right
                player.direction = "up-right";
                if (!isOccupied(player.toPosition[1] - 1, player.toPosition[0] + 1)) {
                    player.toPosition[0] += 1;
                    player.toPosition[1] -= 1;
                }
            } else if (controls[40] && controls[37]) { // down and left
                player.direction = "down-left";
                if (!isOccupied(player.toPosition[1] + 1, player.toPosition[0] - 1)) {
                    player.toPosition[0] -= 1;
                    player.toPosition[1] += 1;
                }
            } else if (controls[40] && controls[39]) { // down and right
                player.direction = "down-right"
                if (!isOccupied(player.toPosition[1] + 1, player.toPosition[0] + 1)) {
                    player.toPosition[0] += 1;
                    player.toPosition[1] += 1;
                }
            } else if (controls[38]) { //up
                player.direction = "up";
                if (!isOccupied(player.toPosition[1] - 1, player.toPosition[0])) {
                    player.toPosition[1] -= 1;
                }
            } else if (controls[40]) { //down
                player.direction = "down";
                if (!isOccupied(player.toPosition[1] + 1, player.toPosition[0])) {
                    player.toPosition[1] += 1;
                }
            } else if (controls[37]) { //left
                player.direction = "left";
                if (!isOccupied(player.toPosition[1], player.toPosition[0] - 1)) {
                    player.toPosition[0] -= 1;
                }          
            } else if (controls[39]) { //right
                player.direction = "right";
                if (!isOccupied(player.toPosition[1], player.toPosition[0] + 1)) {
                    player.toPosition[0] += 1;
                }
            }
            
            if (controls[81] && !controls[37] && !controls[38] && !controls[39] && !controls[40]) { //attack
                for (let i = 0; i < zombie.length; i++) {
                    if (zombie[i].inRange) {
                        zombie[i].health -= 1;
                    }
                }
                if (frame > 21) {
                    frame = 0;
                } else {
                    frame += 1;
                }
            }

            if (!controls[81]) {
                frame = 0;
            }

            if (player.fromPosition[0] != player.toPosition[0]) {
                player.timeMoved = currentTime();
            } else if (player.fromPosition[1] != player.toPosition[1]) {
                player.timeMoved = currentTime();
            }
        }
    } 

    setCamera(player.position[0] + (player.size[0] / 2), player.position[1] + (player.size[1] / 2));

    const mapImage = new Image();
    mapImage.src = "..//assets/map.jpg";
    
    ctx.fillStyle = "#105db0";
    ctx.fillRect(0, 0, camera.screen[0], camera.screen[1]);
    ctx.drawImage(mapImage, (camera[0] + camera.center[0] * tileWidth) - 40, (camera[1] + camera.center[1] * tileHeight) - 40);

    for (let i = 0; i < zombie.length; i++) { // remove dead zombies and add points for each dead zombies
        if (zombie[i].health == 0 || zombie[i].health < 0) { 
            const index = zombie.indexOf(zombie[i]);
            if (index > -1) {
                zombie.splice(index, 1);
                player.score += 1;
            }
        }
    }

    for (let i = 0; i < zombie.length; i++) {
        const zombieImage = new Image();
        zombieImage.src = zombie[i].images[zombie[i].direction];
        ctx.drawImage(zombieImage, camera[0] + zombie[i].position[0], camera[1] + zombie[i].position[1])
        ctx.fillStyle = "#FF0000";
        ctx.fillText(zombie[i].health, (camera[0] + zombie[i].position[0]), (camera[1] + zombie[i].position[1]) - 10)
    }

    const playerImage = new Image();
    if (frame > 0) {
        let animationImg = Math.floor(frame);
        playerImage.src = "..//assets/player/punch-animation/punch" + animationImg.toString() + ".png";
    } else {
        playerImage.src = player.images[player.direction];
    }

    ctx.drawImage(playerImage, camera[0] + player.position[0], camera[1] + player.position[1])
    ctx.fillStyle = "#f5f5f5";
    ctx.font = "30px Arial";
    ctx.fillText("Health: " + Math.floor(player.health),10, 35);
    ctx.fillText("Score: " + player.score, 10, 70)

    if (player.health <= 0) {
        const game_over = new Image();
        game_over.src = "..//assets/game_over.png";
        ctx.drawImage(game_over, 100, 100);
    }

    const user = sessionStorage.key(0);
    let details = JSON.parse(sessionStorage.getItem(user));
    details["Score"] = player.score;
    localStorage.setItem(user, JSON.stringify(details))

    requestAnimationFrame(displayGame);
}

