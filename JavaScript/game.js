const mapImage = new Image();
mapImage.src = "..//assets/game/map.jpg";

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

const currentTime = Date.now;
let frame = 1;
let round = 1;

class Player {
    constructor(score, health, timeMoved, size, position, fromPosition, toPosition, delayMove, images, direction, damage) {
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
        this.damage = damage;
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
const images = {"up": "..//assets/player/walking/up.png",
                             "up-right": "..//assets/player/walking/up-right.png",
                             "right": "..//assets/player/walking/right.png",
                             "down-right": "..//assets/player/walking/down-right.png",
                             "down": "..//assets/player/walking/down.png",
                             "down-left": "..//assets/player/walking/down-left.png",
                             "left": "..//assets/player/walking/left.png",
                             "up-left": "..//assets/player/walking/up-left.png"}
                                
const player = new Player(0, 100, 0, [tileWidth, tileHeight], playerSpawn, playerToPosition, playerFromPosition, 275, images, "up", 1);

//zombies
let coordinate = 0;
let spawnCoordinates = [];
while (coordinate != 1520) {
    coordinate += 40;
    spawnCoordinates.push(coordinate);
}

class Zombie {
    constructor(damage, health, timeMoved, size, position, fromPosition, toPosition, delayMove, images, direction) {
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

const zombie = [];

function spawnZombies(zombieAmount, zombie) {
    for (let i = 0; i < zombieAmount; i++) {
        let spawn = [spawnCoordinates[Math.floor(Math.random() * spawnCoordinates.length)], spawnCoordinates[Math.floor(Math.random() * spawnCoordinates.length)]];
        let x = spawn[0] / tileWidth;
        let y = spawn[1] / tileHeight;
        if (map[y][x] == 1) {
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
        
            zombie.push(new Zombie(0.03, 100, 0, [tileWidth, tileHeight], spawn, zombieFromPosition, zombieToPosition, 350, images, "up")) 
        }
    }
}

class Drop {
    constructor(health, damage, image, position, tilePosition) {
        this.health = health;
        this.damage = damage;
        this.image = image;
        this.position = position;
        this.tilePosition = tilePosition;
    }
}

const drops = [];

// camera
class Camera {
    constructor(positionX, positionY, screen, topLeft, bottomRight, center) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.screen = screen;
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
        this.center = center;
    }

    setCamera(x, y) {
        this.positionX = Math.floor((this.screen[0] / 2) - x);
        this.positionY = Math.floor((this.screen[1] / 2) - y);

        let tile = [Math.floor(x / tileWidth), Math.floor(y / tileHeight)];

        this.topLeft[0] = tile[0] - 1 - Math.ceil((this.screen[0] / 2) / tileWidth);
        this.topLeft[1] = tile[1] - 1 - Math.ceil((this.screen[1] / 2) / tileHeight);

        if (this.topLeft[0] < 0) {
            this.topLeft[0] = 0;
        }

        if (this.topLeft[1] < 0) {
            this.topLeft[1] = 0;
        }

        this.bottomRight[0] = tile[0] + 1 + Math.ceil((this.screen[0] / 2) / tileWidth);
        this.bottomRight[1] = tile[1] + 2 + Math.ceil((this.screen[1] / 2) / tileHeight);

        if (this.bottomRight[0] >= mapWidth) {
            this.bottomRight[0] = mapWidth - 1;
        }

        if (this.bottomRight[1] >= mapHeight) {
            this.bottomRight[1] = mapHeight - 1;
        }
    }
}

camera = new Camera(0, 0, [0, 0], [0, 0], [0, 0], [0, 0])

const controls = {65: false, //Left
                               87: false, //Up
                               68: false, //Right
                               83: false, //Down
                               32: false, //Attack
                               82: false, //Restart
                               81: false}; //Quit

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
    if (player.health > 0) { 
        if (zombie.length < 5) {
            round++;
            spawnZombies(5 + round, zombie);
        }
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

            //collisions (zombie attacks player)
            zombie[i].inRange = false;
            if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1 || //left
                player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] + 1 || //right
                player.toPosition[0] - 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] || //above
                player.toPosition[0] + 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] || //below
                player.toPosition[0] - 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1 || //up-left
                player.toPosition[0] + 1== zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] + 1 || //down-right
                player.toPosition[0] - 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1]  + 1|| //up-right
                player.toPosition[0] + 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1) { //down-left
                player.health -= zombie[i].damage;
            }
        }

        if (!player.updatePosition(currentTime())) { //movements for player
            if (controls[87] && controls[65]) { // up and left
                player.direction = "up-left";
                if (!isOccupied(player.toPosition[1] - 1, player.toPosition[0] - 1)) {
                    player.toPosition[0] -= 1;
                    player.toPosition[1] -= 1; 
                }
            } else if (controls[87] && controls[68]) { // up and right
                player.direction = "up-right";
                if (!isOccupied(player.toPosition[1] - 1, player.toPosition[0] + 1)) {
                    player.toPosition[0] += 1;
                    player.toPosition[1] -= 1;
                }
            } else if (controls[83] && controls[65]) { // down and left
                player.direction = "down-left";
                if (!isOccupied(player.toPosition[1] + 1, player.toPosition[0] - 1)) {
                    player.toPosition[0] -= 1;
                    player.toPosition[1] += 1;
                }
            } else if (controls[83] && controls[68]) { // down and right
                player.direction = "down-right"
                if (!isOccupied(player.toPosition[1] + 1, player.toPosition[0] + 1)) {
                    player.toPosition[0] += 1;
                    player.toPosition[1] += 1;
                }
            } else if (controls[87]) { //up
                player.direction = "up";
                if (!isOccupied(player.toPosition[1] - 1, player.toPosition[0])) {
                    player.toPosition[1] -= 1;
                }
            } else if (controls[83]) { //down
                player.direction = "down";
                if (!isOccupied(player.toPosition[1] + 1, player.toPosition[0])) {
                    player.toPosition[1] += 1;
                }
            } else if (controls[65]) { //left
                player.direction = "left";
                if (!isOccupied(player.toPosition[1], player.toPosition[0] - 1)) {
                    player.toPosition[0] -= 1;
                }          
            } else if (controls[68]) { //right
                player.direction = "right";
                if (!isOccupied(player.toPosition[1], player.toPosition[0] + 1)) {
                    player.toPosition[0] += 1;
                }
            }
            
            if (controls[32] && !controls[65] && !controls[87] && !controls[68] && !controls[83]) { //attack
                for (let i = 0; i < zombie.length; i++) {
                    // collisions (player attacks zombie)
                    if (player.direction == "down") {  
                        if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1 ||
                            player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] - 1 ||
                            player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] - 1) {
                            zombie[i].health -= player.damage;
                        }
                    } else if (player.direction == "up") { 
                        if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] + 1 ||
                            player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] + 1 ||
                            player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] + 1) {
                            zombie[i].health -= player.damage;
                        }
                    } else if (player.direction == "left") { 
                        if (player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] ||
                            player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] + 1 ||
                            player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] - 1) {
                            zombie[i].health -= player.damage;
                        }
                    } else if (player.direction == "right") {
                        if (player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] ||
                            player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] + 1 ||
                            player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] - 1) {
                            zombie[i].health -= player.damage;
                        }
                    } else if (player.direction == "up-right") { 
                        if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] + 1 ||
                            player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] ||
                            player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] + 1) {
                            zombie[i].health -= player.damage;
                        }
                    } else if (player.direction == "up-left") { 
                        if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] + 1 ||
                            player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] ||
                            player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] + 1) {
                            zombie[i].health -= player.damage;
                        }
                    } else if (player.direction == "down-right") {
                        if (player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] ||
                            player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1 ||
                            player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] - 1) {
                            zombie[i].health -= player.damage;
                        }
                    } else if (player.direction == "down-left") { 
                        if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1 ||
                            player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] ||
                            player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] - 1) {
                            zombie[i].health -= player.damage;
                        }
                    }
                }

                if (frame > 6) {
                    frame = 1;
                    frame += 0.1;
                } else {
                    frame += 0.1;
                }
            }

            if (!controls[32]) {
                frame = 1;
            }

            if (player.fromPosition[0] != player.toPosition[0]) {
                player.timeMoved = currentTime();
            } else if (player.fromPosition[1] != player.toPosition[1]) {
                player.timeMoved = currentTime();
            }
        }
    

    camera.setCamera(player.position[0] + (player.size[0] / 2), player.position[1] + (player.size[1] / 2));

    ctx.fillStyle = "#105db0";
    ctx.fillRect(0, 0, camera.screen[0], camera.screen[1]);
    ctx.drawImage(mapImage, (camera.positionX + camera.center[0] * tileWidth) - 40, (camera.positionY + camera.center[1] * tileHeight) - 40);

    for (let i = 0; i < zombie.length; i++) { // remove dead zombies and add points for each dead zombies
        if (zombie[i].health == 0 || zombie[i].health < 0) { 
            let index = zombie.indexOf(zombie[i]);
            if (index > -1) {
                if (Math.floor(Math.random() * 11) > 5) { //50% chance to drop a healing heart
                    drops.push(new Drop(10, 0, "../assets/game/health.png", zombie[i].position, zombie[i].toPosition));
                }
                zombie.splice(index, 1);
                player.score += 1;
            }
        }
    }

    for (let i = 0; i < drops.length; i++) {
        const healthImage = new Image();
        healthImage.src = drops[i].image;
        ctx.drawImage(healthImage, camera.positionX + drops[i].position[0], camera.positionY + drops[i].position[1]);
        if (player.toPosition[0] == drops[i].tilePosition[0] && player.toPosition[1] == drops[i].tilePosition[1]) {
            if (player.health > 90) {
                player.health = 100;
                player.damage += drops[i].damage;
            } else {
                player.health += drops[i].health;
                player.damage += drops[i].damage;
            }
            let index = drops.indexOf(drops[i]);
            if (index > -1) {
                drops.splice(index, 1);
            }
        }
    }

    for (let i = 0; i < zombie.length; i++) {
        const zombieImage = new Image();
        zombieImage.src = zombie[i].images[zombie[i].direction];
        ctx.drawImage(zombieImage, camera.positionX + zombie[i].position[0], camera.positionY + zombie[i].position[1])
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect((camera.positionX + zombie[i].position[0]) - 5, (camera.positionY + zombie[i].position[1]) - 15, 52, 10)
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect((camera.positionX + zombie[i].position[0]) - 4, (camera.positionY + zombie[i].position[1]) - 14, Math.round(zombie[i].health) / 2, 8)
    }

    const playerImage = new Image();
    if (frame > 1) {
        let animationImg = Math.floor(frame);
        playerImage.src = "..//assets/player/punch-" + player.direction + "/punch" + animationImg.toString() + ".png";
    } else {
        playerImage.src = player.images[player.direction];
    }

    ctx.drawImage(playerImage, camera.positionX + player.position[0], camera.positionY + player.position[1])
    
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "22px joystix"
    ctx.fillText("Health: " + Math.round(player.health),12, 555);
    ctx.fillText("Score:  " + player.score, 10, 525)

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(15 - 5, 580 - 15, 202, 30)
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(15 - 4, 580 - 14, Math.round(player.health) * 2, 28)

    } else {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.font = "50px joystix";
        ctx.fillText("GAME OVER!", 367, 290)
        ctx.font = "30px joystix";
        ctx.fillText("R-RESTART", 340, 340)
        ctx.fillText("Q-QUIT", 600, 340)
        if (controls[81]) {
            window.open("../index.html", "_self")
        } else if (controls[82]) {
            window.open("../HTML/game.html", "_self")
        }
        const user = sessionStorage.getItem("User")
        let details = JSON.parse(localStorage.getItem(user));
        if (player.score > details["Score"]) {
            details["Score"] = player.score;
            localStorage.setItem(user, JSON.stringify(details))
        }
    }
    requestAnimationFrame(displayGame);
}
