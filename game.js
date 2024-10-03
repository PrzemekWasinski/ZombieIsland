document.addEventListener("DOMContentLoaded", () => {

    const map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

    const colours = {0: "#338a0e", //Trees
                                  1: "#6beb34", //Grass
                                  2: "#0471c4", //Water
                                  3: "#ebcc52", //Sand
                                  4: "#7d3909", //Wood
                                  "player": "#6e00b8", //Player
                                  "zombies": "#c70d00", //Zombie
                                  "font": "#f5f5f5"} //Font colour

    const mapWidth = map[0].length;
    const mapHeight = map.length;
    
    const tileWidth = 40;
    const tileHeight = 40;

    // player
    const player = new Player();

    function Player() {
        this.score = 0;
        this.health = 100;
        this.timeMoved = 0;
        this.size = [tileWidth, tileHeight];
        this.position = [720, 800];
        this.fromPosition = [this.position[0] / this.size[0], this.position[1] / this.size[1]];
        this.toPosition = [this.position[0] / this.size[0], this.position[1] / this.size[1]];
        this.delayMove = 275;
    }

    Player.prototype.move = function(x, y) {
        this.fromPosition = [x, y];
        this.toPosition = [x, y];
        this.position = [((tileWidth * x) + ((tileWidth - this.size[0]) / 2)), ((tileHeight * y) + ((tileHeight - this.size[1]) / 2))];
    }

    Player.prototype.updatePosition = function(time) {
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

    //zombies
    const spawnCoordinates = [];
    let coordinate = 0;
    
    while (coordinate != 1520) {
        coordinate += 40;
        spawnCoordinates.push(coordinate);
    }

    const zombieAmount = 10;

    let zombie = [];
    for (i = 0; i < zombieAmount; i++) {
        let spawnY = spawnCoordinates[Math.floor(Math.random()*spawnCoordinates.length)];
        let spawnX = spawnCoordinates[Math.floor(Math.random()*spawnCoordinates.length)];

        zombie.push(new Zombie())

        function Zombie() {
            this.inRange = false;
            this.damage = 0.01;
            this.health = 100;
            this.timeMoved = 0;
            this.size = [tileWidth, tileHeight];
            this.position = [spawnY, spawnX];
            this.fromPosition = [spawnY / this.size[0], spawnX / this.size[1]];
            this.toPosition = [spawnY / this.size[0], spawnX / this.size[1]];
            this.delayMove = 410;
        }

        Zombie.prototype.move = function(x, y) {
            this.fromPosition = [x, y];
            this.toPosition = [x, y];
            this.position = [((tileWidth * x) + ((tileWidth - this.size[0]) / 2)), ((tileHeight * y) + ((tileHeight - this.size[1]) / 2))];
        }

        Zombie.prototype.updatePosition = function(time) {
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

    // camera
    const camera = {screen : [0, 0],
                                  topLeft : [0, 0],
                                  bottomRight : [0, 0],
                                  position : [0, 0]};

    function setCamera(px, py) {
        camera.position[0] = Math.floor((camera.screen[0] / 2) - px);
        camera.position[1] = Math.floor((camera.screen[1] / 2) - py);

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

    const controls = {37: false,
                                   38: false,
                                   39: false,
                                   40: false,
                                   81: false};

    window.onload = function() {
        camera.screen = [document.getElementById("game").width, document.getElementById("game").height]
        canvas = document.getElementById("game").getContext("2d");
        requestAnimationFrame(displayGame);

        window.addEventListener("keydown", function(event) { // If user presses down a key
            controls[event.keyCode] = true; // Set key down to true
        });
        window.addEventListener("keyup", function(event) { // If user lets go of a key
            controls[event.keyCode] = false; // Set key down to false
        });
    }

    function displayGame() {
        for (i = 0; i < zombieAmount; i++) {
            if (!zombie[i].updatePosition(Date.now())) { //movements for zombies
                if (player.position[1] < zombie[i].position[1] && player.position[0] < zombie[i].position[0]) { // up and left
                    if (zombie[i].fromPosition[1] > 0 && zombie[i].fromPosition[0] > 0) {
                        if (map[zombie[i].fromPosition[1] - 1][zombie[i].fromPosition[0]] == 1 && 
                            map[zombie[i].fromPosition[1]][zombie[i].fromPosition[0] - 1] == 1 && 
                            map[zombie[i].fromPosition[1] - 1][zombie[i].fromPosition[0] - 1] == 1) {
                            zombie[i].toPosition[0] -= 1;
                            zombie[i].toPosition[1] -= 1;
                        }
                    }
                } else if (player.position[1] < zombie[i].position[1] && player.position[0] > zombie[i].position[0]) { // up and right
                    if (zombie[i].fromPosition[1] > 0 && zombie[i].fromPosition[0] < (mapWidth - 1)) {
                        if (map[zombie[i].fromPosition[1] - 1][zombie[i].fromPosition[0]] == 1 &&
                            map[zombie[i].fromPosition[1]][zombie[i].fromPosition[0] + 1] == 1 &&
                            map[zombie[i].fromPosition[1] - 1][zombie[i].fromPosition[0] + 1] == 1) {
                            zombie[i].toPosition[0] += 1;
                            zombie[i].toPosition[1] -= 1;
                        }
                    }
                } else if (player.position[1] > zombie[i].position[1] && player.position[0] < zombie[i].position[0]) { // down and left
                    if (zombie[i].fromPosition[1] < (mapHeight - 1) && zombie[i].fromPosition[0] > 0) {
                        if (map[zombie[i].fromPosition[1] + 1][zombie[i].fromPosition[0]] == 1 &&
                            map[zombie[i].fromPosition[1]][zombie[i].fromPosition[0] - 1] == 1 &&
                            map[zombie[i].fromPosition[1] + 1][zombie[i].fromPosition[0] - 1] == 1) {
                            zombie[i].toPosition[0] -= 1;
                            zombie[i].toPosition[1] += 1;
                        }
                    }
                } else if (player.position[1] > zombie[i].position[1] &&  player.position[0] > zombie[i].position[0]) { // down and right
                    if (zombie[i].fromPosition[1] < (mapHeight - 1) && zombie[i].fromPosition[0] < (mapWidth - 1)) {
                        if (map[zombie[i].fromPosition[1] + 1][zombie[i].fromPosition[0]] == 1 &&
                            map[zombie[i].fromPosition[1]][zombie[i].fromPosition[0] + 1] == 1 &&
                            map[zombie[i].fromPosition[1] + 1][zombie[i].fromPosition[0] + 1] == 1) {
                            zombie[i].toPosition[0] += 1;
                            zombie[i].toPosition[1] += 1;
                        }
                    }
                } else if (player.position[1] < zombie[i].position[1]) { //up if player is above
                    if (zombie[i].fromPosition[1] > 0) {
                        if (map[zombie[i].fromPosition[1] - 1][zombie[i].fromPosition[0]] == 1) { 
                            zombie[i].toPosition[1] -= 1;
                        }
                    }
                } else if (player.position[1] > zombie[i].position[1]) { //down if player is below
                    if (zombie[i].fromPosition[1] < (mapHeight - 1)) {
                        if (map[zombie[i].fromPosition[1] + 1][zombie[i].fromPosition[0]] == 1) {
                            zombie[i].toPosition[1] += 1;
                        }
                    }
                } else if (player.position[0] < zombie[i].position[0]) { //left if player is to the right
                    if (zombie[i].fromPosition[0] > 0) {
                        if (map[zombie[i].fromPosition[1]][zombie[i].fromPosition[0] - 1] == 1) {
                            zombie[i].toPosition[0] -= 1;
                        }
                    }                
                } else if (player.position[0] > zombie[i].position[0]) { //right if player is to the left
                    if (zombie[i].fromPosition[0] < (mapWidth - 1)) {
                        if (map[zombie[i].fromPosition[1]][zombie[i].fromPosition[0] + 1] == 1) { 
                            zombie[i].toPosition[0] += 1;
                        }
                    }
                }
                
                if (zombie[i].fromPosition[0] != zombie[i].toPosition[0]) {
                    zombie[i].timeMoved = Date.now();
                } else if (zombie[i].fromPosition[1] != zombie[i].toPosition[1]) {
                    zombie[i].timeMoved = Date.now();
                }
            }

            zombie[i].inRange = false;

            //collisions
            if (player.position[1] - 40 < zombie[i].position[1] && player.position[1] + 40 > zombie[i].position[1] ||
                player.position[1] + 40 < zombie[i].position[1] && player.position[1] - 40 > zombie[i].position[1]) {
                    if (player.position[0] == zombie[i].position[0]) {
                        if (zombie[i].health > 0) {
                            player.health -= zombie[i].damage;
                            zombie[i].inRange = true;
                        }
                    }
                }

            if (player.position[0] - 40 < zombie[i].position[0] && player.position[0] + 40 > zombie[i].position[0] ||
                player.position[0] + 40 < zombie[i].position[0] && player.position[0] - 40 > zombie[i].position[0]) {
                    if (player.position[1] == zombie[i].position[1]) {
                        if (zombie[i].health > 0) {
                            player.health -= zombie[i].damage;
                            zombie[i].inRange = true;
                        }
                    }
                }
            }

        if (!player.updatePosition(Date.now())) { //movements for player
            if (controls[38] && controls[37]) { // up and left
                if (player.fromPosition[1] > 0 && player.fromPosition[0] > 0) {
                    if (map[player.fromPosition[1] - 1][player.fromPosition[0]] == 1 && 
                        map[player.fromPosition[1]][player.fromPosition[0] - 1] == 1 && 
                        map[player.fromPosition[1] - 1][player.fromPosition[0] - 1] == 1) {
                        player.toPosition[0] -= 1;
                        player.toPosition[1] -= 1;
                    }
                }
            } else if (controls[38] && controls[39]) { // up and right
                if (player.fromPosition[1] > 0 && player.fromPosition[0] < (mapWidth - 1)) {
                    if (map[player.fromPosition[1] - 1][player.fromPosition[0]] == 1 &&
                        map[player.fromPosition[1]][player.fromPosition[0] + 1] == 1 &&
                        map[player.fromPosition[1] - 1][player.fromPosition[0] + 1] == 1) {
                        player.toPosition[0] += 1;
                        player.toPosition[1] -= 1;
                    }
                }
            } else if (controls[40] && controls[37]) { // down and left
                if (player.fromPosition[1] < (mapHeight - 1) && player.fromPosition[0] > 0) {
                    if (map[player.fromPosition[1] + 1][player.fromPosition[0]] == 1 &&
                        map[player.fromPosition[1]][player.fromPosition[0] - 1] == 1 &&
                        map[player.fromPosition[1] + 1][player.fromPosition[0] - 1] == 1) {
                        player.toPosition[0] -= 1;
                        player.toPosition[1] += 1;
                    }
                }
            } else if (controls[40] && controls[39]) { // down and right
                if (player.fromPosition[1] < (mapHeight - 1) && player.fromPosition[0] < (mapWidth - 1)) {
                    if (map[player.fromPosition[1] + 1][player.fromPosition[0]] == 1 &&
                        map[player.fromPosition[1]][player.fromPosition[0] + 1] == 1 &&
                        map[player.fromPosition[1] + 1][player.fromPosition[0] + 1] == 1) {
                        player.toPosition[0] += 1;
                        player.toPosition[1] += 1;
                    }
                }
            } else if (controls[38]) { //up
                if (player.fromPosition[1] > 0) {
                    if (map[player.fromPosition[1] - 1][player.fromPosition[0]] == 1) { 
                        player.toPosition[1] -= 1;
                    }
                }
            } else if (controls[40]) { //down
                if (player.fromPosition[1] < (mapHeight - 1)) {
                    if (map[player.fromPosition[1] + 1][player.fromPosition[0]] == 1) {
                        player.toPosition[1] += 1;
                    }
                }
            } else if (controls[37]) { //left
                if (player.fromPosition[0] > 0) {
                    if (map[player.fromPosition[1]][player.fromPosition[0] - 1] == 1) {
                        player.toPosition[0] -= 1;
                    }
                }                
            } else if (controls[39]) { //right
                if (player.fromPosition[0] < (mapWidth - 1)) {
                    if (map[player.fromPosition[1]][player.fromPosition[0] + 1] == 1) { 
                        player.toPosition[0] += 1;
                    }
                }
            }
            if (controls[81]) { //attack
                for (i = 0; i < zombieAmount; i++) {
                    if (zombie[i].inRange) {
                        zombie[i].health -= 1;
                    }
                }
            }

            if (player.fromPosition[0] != player.toPosition[0]) {
                player.timeMoved = Date.now();
            } else if (player.fromPosition[1] != player.toPosition[1]) {
                player.timeMoved = Date.now();
            }
        }
            
        setCamera(player.position[0] + (player.size[0] / 2), player.position[1] + (player.size[1] / 2));
        canvas.fillStyle = colours[2] // Make background blue
        canvas.fillRect(0, 0, camera.screen[0], camera.screen[1]);

        for (i = camera.topLeft[1]; i <= camera.bottomRight[1]; i++) { //Fill in visible area
            for (j = camera.topLeft[0]; j <= camera.bottomRight[0]; j++) {
                canvas.fillStyle = colours[map[i][j]];
                canvas.fillRect(camera.position[0] + j * tileWidth, camera.position[1] + i * tileHeight, tileWidth, tileHeight);
            }
        }
        
        for (i = 0; i < zombieAmount; i++) {
            if (zombie[i].health == 0) { //Add points for each dead zombie and remove dead zombies
                player.score += 1;
                zombie[i].health = -1;
            }

            if (zombie[i].health > 0) { //If zombie is alive draw it on the display
                canvas.fillStyle = colours["zombies"];
                canvas.fillRect(camera.position[0] + zombie[i].position[0], camera.position[1] + zombie[i].position[1], zombie[i].size[0], zombie[i].size[1]);
                canvas.fillText(zombie[i].health, (camera.position[0] + zombie[i].position[0]), (camera.position[1] + zombie[i].position[1]) - 10)
            }
        }

        canvas.fillStyle = colours["player"];
        canvas.fillRect(camera.position[0] + player.position[0], camera.position[1] + player.position[1], player.size[0], player.size[1]);

        canvas.fillStyle = colours["font"];
        canvas.font = "30px Arial";
        canvas.fillText("Health: " + Math.floor(player.health),10, 35);
        canvas.fillText("Score: " + player.score, 10, 70)
        
        requestAnimationFrame(displayGame);
    }
})
