import { Player } from "./classes/player.js";
import { Camera } from "./classes/camera.js";
import { Drop } from "./classes/drop.js";
import { spawnZombies, isOccupied } from "./functions.js";

const mapImage = new Image(); //Make a new image object for the map
mapImage.src = "../assets/game/map.jpg"; //Set the path to the image

const map =  [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //A 2D array which stores tiles, 1s are passable 0s are not
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

const tileWidth = 40; //Size of each tile in pixels
const tileHeight = 40;

let coordinate = 0; //Add all possible coordinates to a list
let spawnCoordinates = [];
while (coordinate != 1520) {
    coordinate += 40;
    spawnCoordinates.push(coordinate);
}

const currentTime = Date.now; //Set current time, frame and round
let frame = 1;
let round = 1;

const camera = new Camera(0, 0, [0, 0], [0, 0], [0, 0], [0, 0]) //Make a camera object

const playerSpawn = [920, 880]; //Set the player spawn
const playerToPosition = [[playerSpawn[0] / tileWidth, playerSpawn[1] / tileHeight]];
const playerFromPosition = [playerSpawn[0] / tileWidth, playerSpawn[1] / tileHeight];
const images = {"up": "../assets/player/walking/up.png", //Store all the player images in a hash table
                            "up-right": "../assets/player/walking/up-right.png",
                            "right": "../assets/player/walking/right.png",
                            "down-right": "../assets/player/walking/down-right.png",
                            "down": "../assets/player/walking/down.png",
                            "down-left": "../assets/player/walking/down-left.png",
                            "left": "../assets/player/walking/left.png",
                            "up-left": "../assets/player/walking/up-left.png"}
                                
const player = new Player(0, 100, 0, [tileWidth, tileHeight], playerSpawn, playerToPosition, playerFromPosition, 275, images, "up", 1); //Create player object

const zombie = []; //Store zombies and drops in lists
const drops = [];

//A hash table that stores the state of each key
const controls = {65: false, //Left
                            87: false, //Up
                            68: false, //Right
                            83: false, //Down
                            32: false, //Attack
                            82: false, //Restart
                            81: false}; //Quit

window.onload = function() {
    camera.screen = [document.getElementById("game").width, document.getElementById("game").height] //Give the camera the canvas dimensions
    const canvas = document.getElementById("game");
    window.ctx = canvas.getContext("2d");

    requestAnimationFrame(displayGame);

    window.addEventListener("keydown", function(event) { // If user presses down a key
        controls[event.keyCode] = true; // Set that key down to true
    });
    window.addEventListener("keyup", function(event) { // If user lets go of a key
        controls[event.keyCode] = false; // Set that key down to false
    });
}

spawnZombies(10, zombie, spawnCoordinates, tileWidth, tileHeight, map); //Spawn 10 zombies at the start

function displayGame() {
    if (sessionStorage.getItem("Current-user") !== null && sessionStorage.getItem("Current-user") !== undefined) { //If the player is logged in
        if (player.health > 0) { //If the player is alive
            if (zombie.length < 5) { //If theres less than 5 zombies
                spawnZombies(5 + round, zombie, spawnCoordinates, tileWidth, tileHeight, map); //Spawn 5 more zombies + whichever round the player is on
                round++; //Move onto the next round
            }

            for (let i = 0; i < zombie.length; i++) { //For every zombie
                if (!zombie[i].updatePosition(currentTime())) {//If zombie has moved
                    if (player.position[1] < zombie[i].position[1] && player.position[0] < zombie[i].position[0]) { //If the player is above and to the left
                        zombie[i].direction = "up-left"; //Set the zombie's direction accordingly
                        if (!isOccupied(player, map, zombie, zombie[i].toPosition[1] - 1, zombie[i].toPosition[0] - 1)) { //If the destination tile is unoccupied
                            zombie[i].toPosition[0] -= 1; //Move the zombie's image up and left
                            zombie[i].toPosition[1] -= 1;
                        }
                    } else if (player.position[1] < zombie[i].position[1] && player.position[0] > zombie[i].position[0]) { //If the player is above and to the right
                        zombie[i].direction = "up-right"; //Set the zombie's direction accordingly
                        if (!isOccupied(player, map, zombie, zombie[i].toPosition[1] - 1, zombie[i].toPosition[0] + 1)) { //If the destination tile is unoccupied
                            zombie[i].toPosition[0] += 1; //Move the zombie's image up and to the right
                            zombie[i].toPosition[1] -= 1;
                        }
                    } else if (player.position[1] > zombie[i].position[1] && player.position[0] < zombie[i].position[0]) { // down and left
                        zombie[i].direction = "down-left"; //Set the zombie's direction accordingly
                        if (!isOccupied(player, map, zombie, zombie[i].toPosition[1] + 1, zombie[i].toPosition[0] - 1)) { //If the destination tile is unoccupied
                            zombie[i].toPosition[0] -= 1; //Move the zombie's image down and to the left
                            zombie[i].toPosition[1] += 1;
                        }
                    } else if (player.position[1] > zombie[i].position[1] &&  player.position[0] > zombie[i].position[0]) { // down and right
                        zombie[i].direction = "down-right"; //Set the zombie's direction accordingly
                        if (!isOccupied(player, map, zombie, zombie[i].toPosition[1] + 1, zombie[i].toPosition[0] + 1)) { //If the destination tile is unoccupied                     
                            zombie[i].toPosition[0] += 1; //Move the zombie's image down and to the right
                            zombie[i].toPosition[1] += 1;
                        }
                    } else if (player.position[1] < zombie[i].position[1]) { // move up if player is above
                        zombie[i].direction = "up"; //Set the zombie's direction accordingly
                        if (!isOccupied(player, map, zombie, zombie[i].toPosition[1] - 1, zombie[i].toPosition[0])) { //If the destination tile is unoccupied
                            zombie[i].toPosition[1] -= 1; //Move the zombie's image up
                        }
                    } else if (player.position[1] > zombie[i].position[1]) { // move down if player is below
                        zombie[i].direction = "down"; //Set the zombie's direction accordingly
                        if (!isOccupied(player, map, zombie, zombie[i].toPosition[1] + 1, zombie[i].toPosition[0])) { //If the destination tile is unoccupied
                            zombie[i].toPosition[1] += 1; //Move the zombie's image down
                        }
                    } else if (player.position[0] < zombie[i].position[0]) { // move left if player is to the right
                        zombie[i].direction = "left"; //Set the zombie's direction accordingly
                        if (!isOccupied(player, map, zombie, zombie[i].toPosition[1], zombie[i].toPosition[0] - 1)) { //If the destination tile is unoccupied
                            zombie[i].toPosition[0] -= 1; //Move the zombie's image left
                        }                
                    } else if (player.position[0] > zombie[i].position[0]) { // move right if player is to the left
                        zombie[i].direction = "right"; //Set the zombie's direction accordingly
                        if (!isOccupied(player, map, zombie, zombie[i].toPosition[1], zombie[i].toPosition[0] + 1)) { //If the destination tile is unoccupied
                            zombie[i].toPosition[0] += 1; //Move the zombie's image right
                        }
                    }
                    
                    if (zombie[i].fromPosition[0] != zombie[i].toPosition[0]) { //If zombie still needs to move vertically
                        zombie[i].timeMoved = currentTime(); //Keep track of the time to compare later
                    } else if (zombie[i].fromPosition[1] != zombie[i].toPosition[1]) { //If zombie still needs to move horizontally
                        zombie[i].timeMoved = currentTime(); //Keep track of the time to compare later
                    }
                }

                //collisions (zombie attacks player)
                zombie[i].inRange = false; //Set the zombie to not be in range of the player
                if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1 || //left
                    player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] + 1 || //right
                    player.toPosition[0] - 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] || //above
                    player.toPosition[0] + 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] || //below
                    player.toPosition[0] - 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1 || //up-left
                    player.toPosition[0] + 1== zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] + 1 || //down-right
                    player.toPosition[0] - 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1]  + 1|| //up-right
                    player.toPosition[0] + 1 == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1) { //down-left
                    player.health -= zombie[i].damage; //Player loses health if the zombies are next to the player
                }
            }

            if (!player.updatePosition(currentTime())) { //If player has moved
                if (controls[87] && controls[65]) { // If the player has moved up and to the left
                    player.direction = "up-left"; //Set the player's direction accordingly
                    if (!isOccupied(player, map, zombie, player.toPosition[1] - 1, player.toPosition[0] - 1)) { //If the destination tile is unoccupied
                        player.toPosition[0] -= 1; //Move the player's image up and to the left
                        player.toPosition[1] -= 1; 
                    }
                } else if (controls[87] && controls[68]) { //If the player has moved up and to the right
                    player.direction = "up-right"; //Set the player's direction accordingly
                    if (!isOccupied(player, map, zombie, player.toPosition[1] - 1, player.toPosition[0] + 1)) { //If the destination tile is unoccupied
                        player.toPosition[0] += 1; //Move the player's image up and to the right
                        player.toPosition[1] -= 1;
                    }
                } else if (controls[83] && controls[65]) { //If the player has moved down and to the left
                    player.direction = "down-left"; //Set the player's direction accordingly
                    if (!isOccupied(player, map, zombie, player.toPosition[1] + 1, player.toPosition[0] - 1)) { //If the destination tile is unoccupied
                        player.toPosition[0] -= 1; //Move the player's image down and to the left
                        player.toPosition[1] += 1;
                    }
                } else if (controls[83] && controls[68]) { //If the player has moved down and to the right
                    player.direction = "down-right"; //Set the player's direction accordingly
                    if (!isOccupied(player, map, zombie, player.toPosition[1] + 1, player.toPosition[0] + 1)) { //If the destination tile is unoccupied
                        player.toPosition[0] += 1; //Move the player's image down and to the right
                        player.toPosition[1] += 1;
                    }
                } else if (controls[87]) { //If the player has moved up
                    player.direction = "up"; //Set the player's direction accordingly
                    if (!isOccupied(player, map, zombie, player.toPosition[1] - 1, player.toPosition[0])) { //If the destination tile is unoccupied
                        player.toPosition[1] -= 1; //Move the player's image up
                    }
                } else if (controls[83]) { //If the player has moved down
                    player.direction = "down"; //Set the player's direction accordingly
                    if (!isOccupied(player, map, zombie, player.toPosition[1] + 1, player.toPosition[0])) { //If the destination tile is unoccupied
                        player.toPosition[1] += 1; //Move the player's image down
                    }
                } else if (controls[65]) { //If the player has moved left
                    player.direction = "left"; //Set the player's direction accordingly
                    if (!isOccupied(player, map, zombie, player.toPosition[1], player.toPosition[0] - 1)) { //If the destination tile is unoccupied
                        player.toPosition[0] -= 1; //Move the player's image to the left
                    }          
                } else if (controls[68]) { //If the player has moved right
                    player.direction = "right"; //Set the player's direction accordingly
                    if (!isOccupied(player, map, zombie, player.toPosition[1], player.toPosition[0] + 1)) { //If the destination tile is unoccupied
                        player.toPosition[0] += 1; //Move the player's image to the right
                    }
                }
                
                if (controls[32] && !controls[65] && !controls[87] && !controls[68] && !controls[83]) { //If the player attacks
                    for (let i = 0; i < zombie.length; i++) { //For every zombie
                        if (player.direction == "down") {  //If the player is facing down
                            if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1 || 
                                player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] - 1 ||
                                player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] - 1) {
                                zombie[i].health -= player.damage;  //Decrease the health of each zombie within 3 tiles in front of the player
                            }
                        } else if (player.direction == "up") { //If the player is facing up
                            if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] + 1 || 
                                player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] + 1 ||
                                player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] + 1) {
                                zombie[i].health -= player.damage; //Decrease the health of each zombie within 3 tiles in front of the player
                            }
                        } else if (player.direction == "left") { //If the player is facing left
                            if (player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] || 
                                player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] + 1 ||
                                player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] - 1) {
                                zombie[i].health -= player.damage; //Decrease the health of each zombie within 3 tiles in front of the player
                            }
                        } else if (player.direction == "right") { //If the player is facing right
                            if (player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] || 
                                player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] + 1 ||
                                player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] - 1) {
                                zombie[i].health -= player.damage; //Decrease the health of each zombie within 3 tiles in front of the player
                            }
                        } else if (player.direction == "up-right") { //If the player is facing up and to the right
                            if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] + 1 || 
                                player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] ||
                                player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] + 1) {
                                zombie[i].health -= player.damage; //Decrease the health of each zombie within 3 tiles in front of the player
                            }
                        } else if (player.direction == "up-left") { //If the player is facing up and to the left
                            if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] + 1 || 
                                player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] ||
                                player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] + 1) {
                                zombie[i].health -= player.damage; //Decrease the health of each zombie within 3 tiles in front of the player
                            }
                        } else if (player.direction == "down-right") { //If the player is facing down and to the right
                            if (player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] || 
                                player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1 ||
                                player.toPosition[0] == zombie[i].toPosition[0] - 1&& player.toPosition[1] == zombie[i].toPosition[1] - 1) {
                                zombie[i].health -= player.damage; //Decrease the health of each zombie within 3 tiles in front of the player
                            }
                        } else if (player.direction == "down-left") { //If the player is facing down and to the left
                            if (player.toPosition[0] == zombie[i].toPosition[0] && player.toPosition[1] == zombie[i].toPosition[1] - 1 || 
                                player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] ||
                                player.toPosition[0] == zombie[i].toPosition[0] + 1&& player.toPosition[1] == zombie[i].toPosition[1] - 1) {
                                zombie[i].health -= player.damage; //Decrease the health of each zombie within 3 tiles in front of the player
                            }
                        }
                    }

                    if (frame > 6) { //If the animation has reached the end
                        frame = 1; //Set the frame to 0
                        frame += 0.1; //Carry on the animation
                    } else { //If animation has nto reached the end
                        frame += 0.1; //Carry on the animation
                    }
                }

                if (!controls[32]) { //If the player stops attacking
                    frame = 1; //Set the animation back to the start
                }

                if (player.fromPosition[0] != player.toPosition[0]) { //If player still needs to move vertically
                    player.timeMoved = currentTime(); //Keep track of the time to compare later
                } else if (player.fromPosition[1] != player.toPosition[1]) { //If player still needs to move vertically
                    player.timeMoved = currentTime(); //Keep track of the time to compare later
                }
            }
        
            camera.setCamera(player.position[0] + (player.size[0] / 2), player.position[1] + (player.size[1] / 2)); //Set the camera so the the player is in the middle

            ctx.fillStyle = "#105db0"; //Set fillstyle to blue
            ctx.fillRect(0, 0, camera.screen[0], camera.screen[1]); //Fill entire screen with blue (water)
            ctx.drawImage(mapImage, (camera.positionX + camera.center[0] * tileWidth) - 40, (camera.positionY + camera.center[1] * tileHeight) - 40); //Draw the map on top

            for (let i = 0; i < zombie.length; i++) { //For each zombie
                if (zombie[i].health <= 0) { //If zombie is dead
                    let index = zombie.indexOf(zombie[i]); //Find where it is in the list
                    if (index > -1) { //When its found
                        if (Math.floor(Math.random() * 11) > 5) { //50% chance to drop a healing heart
                            drops.push(new Drop(10, 0, "../assets/game/health.png", zombie[i].position, zombie[i].toPosition)); //Add the drop to the list of drops
                        }
                        zombie.splice(index, 1); //Remove the dead zombie
                        player.score += 1; //Update the player's score
                    }
                }
            }

            for (let i = 0; i < drops.length; i++) { //For each drop
                const healthImage = new Image(); //Create new image 
                healthImage.src = drops[i].image; //Set the image path
                ctx.drawImage(healthImage, camera.positionX + drops[i].position[0], camera.positionY + drops[i].position[1]); //Draw the drop in the correct position
                if (player.toPosition[0] == drops[i].tilePosition[0] && player.toPosition[1] == drops[i].tilePosition[1]) { //If player walks into the drop add its effects
                    if (player.health > 90) { //If health is higher than 90
                        player.health = 100; //Set the health to 100
                        player.damage += drops[i].damage; //Add the drop's damage to the player
                    } else { //If health is lower than 90
                        player.health += drops[i].health; //Add 10 to the player's health
                        player.damage += drops[i].damage; //Add the drop's damage to the player
                    }
                    let index = drops.indexOf(drops[i]); //Remove the drop after it has been picked up
                    if (index > -1) {
                        drops.splice(index, 1);
                    }
                }
            }

            for (let i = 0; i < zombie.length; i++) { //For each zombie
                const zombieImage = new Image(); //Make a new image
                zombieImage.src = zombie[i].images[zombie[i].direction]; //Set the image path
                ctx.drawImage(zombieImage, camera.positionX + zombie[i].position[0], camera.positionY + zombie[i].position[1]) //Draw the zombie facing it's direction
                ctx.fillStyle = "rgb(0, 0, 0)"; //Set colour to black
                ctx.fillRect((camera.positionX + zombie[i].position[0]) - 5, (camera.positionY + zombie[i].position[1]) - 15, 52, 10) //Draw a black rectangle above the zombie
                ctx.fillStyle = "rgb(255, 0, 0)"; //Set colour to red
                ctx.fillRect((camera.positionX + zombie[i].position[0]) - 4, (camera.positionY + zombie[i].position[1]) - 14, Math.round(zombie[i].health) / 2, 8) //Draw a smaller rectangle on top of the black one to display health
            }

            const playerImage = new Image(); //Make a new image for the player
            if (frame > 1) { //If the player is punching
                let animationImg = Math.floor(frame); //Round the animation's frame
                playerImage.src = "../assets/player/punch-" + player.direction + "/punch" + animationImg.toString() + ".png"; //Find the according image for the animation frame
            } else { //If player isn't punching
                playerImage.src = player.images[player.direction]; //Set the player's image to walking in it's direction
            }

            ctx.drawImage(playerImage, camera.positionX + player.position[0], camera.positionY + player.position[1]) //Draw the player
            
            ctx.fillStyle = "rgb(255, 255, 255)"; //Display health and score
            ctx.font = "22px joystix"
            ctx.fillText("Score:  " + player.score, 10, 525)
            ctx.fillText("Health: " + Math.round(player.health),12, 555);

            ctx.fillStyle = "rgb(0, 0, 0)"; //Draw player's health bar
            ctx.fillRect(15 - 5, 580 - 15, 202, 30)
            ctx.fillStyle = "rgb(0, 255, 0)";
            ctx.fillRect(15 - 4, 580 - 14, Math.round(player.health) * 2, 28)

        } else { //If player is dead
            ctx.fillStyle = "rgb(255, 255, 255)"; //Draw the game over screen
            ctx.font = "50px joystix";
            ctx.fillText("GAME OVER!", 367, 290)
            ctx.font = "30px joystix";
            ctx.fillText("R-RESTART", 340, 340)
            ctx.fillText("Q-QUIT", 600, 340)
            if (controls[81]) { //If user quits
                window.open("../index.html", "_self") //Take them to home page
            } else if (controls[82]) { //If user restarts
                window.open("../HTML/game.html", "_self") //Reload the page
            }
            const user = sessionStorage.getItem("Current-user") //Get the user's username from session storage
            let details = JSON.parse(localStorage.getItem(user)); //Get the user's details
            if (player.score > details["Score"]) { //If user's current score is higher than the saved one
                details["Score"] = player.score; //Update it
                localStorage.setItem(user, JSON.stringify(details)) //Set it in local storage
            }
        }
        requestAnimationFrame(displayGame); //Recall the game function creatig a loop

    } else { //If player is not logged in
        ctx.fillStyle = "rgb(0, 0, 0)"; //Draw "Login to play!" screen"
        ctx.font = "50px joystix";
        ctx.fillText("Login to play!", document.getElementById("game").width / 2 - 275, 100)
    }
}
