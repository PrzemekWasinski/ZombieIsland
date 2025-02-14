import { Player } from "./classes/player.js";
import { Camera } from "./classes/camera.js";
import { Drop } from "./classes/drop.js";
import { Weapon } from "./classes/weapon.js";
import { spawnZombies, isOccupied } from "./functions.js";

const mapImage = new Image(); //Make a new image object for the map
mapImage.src = "../assets/ZombieIsland/game/map.jpg"; //Set the path to the image

const map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //A 2D array which stores tiles, 1s are passable 0s are not
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

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
const images = {
    "up": "../assets/ZombieIsland/player/walking/up.png", //Store all the player images in a hash table
    "up-right": "../assets/ZombieIsland/player/walking/up-right.png",
    "right": "../assets/ZombieIsland/player/walking/right.png",
    "down-right": "../assets/ZombieIsland/player/walking/down-right.png",
    "down": "../assets/ZombieIsland/player/walking/down.png",
    "down-left": "../assets/ZombieIsland/player/walking/down-left.png",
    "left": "../assets/ZombieIsland/player/walking/left.png",
    "up-left": "../assets/ZombieIsland/player/walking/up-left.png"
}
  
const fist = new Weapon("fist", 10, "meelee", 0, 0)
const gun = new Weapon("gun", 5, "range", 10, 500)
const player = new Player(0, 100, 0, [tileWidth, tileHeight], playerSpawn, playerToPosition, playerFromPosition, 275, images, "up", 1, [fist, gun], fist); //Create player object

const zombie = []; //Store zombies and drops in lists
const drops = [];
const projectiles = [];

//A hash table that stores the state of each key
const controls = {
    65: false, //Left
    87: false, //Up
    68: false, //Right
    83: false, //Down
    32: false, //Attack
    49: false, //Fist
    50: false, //Gun
    82: false, //Restart
    81: false //Quit
}; 

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

let locked = false;


if (frame > 1) { //If the player is punching
    let animationImg = Math.floor(frame); //Round the animation's frame
    
} else { //If player isn't punching
    playerImage.src = player.images[player.direction]; //Set the player's image to walking in it's direction
}


function displayGame() {
    if (player.health > 0) { //If the player is alive
        if (zombie.length < 5) { //If theres less than 5 zombies
            spawnZombies(5 + round, zombie, spawnCoordinates, tileWidth, tileHeight, map); //Spawn 5 more zombies + whichever round the player is on
            round++; //Move onto the next round
        }

        if (controls[49]) {
            player.weapon = fist
        } else if (controls[50]) {
            player.weapon = gun
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

            zombie[i].weapon.attack(zombie[i], map, projectiles, player)
            function playerAttack() {
                if (!locked) {
                    player.weapon.attack(player, map, projectiles, zombie[i]);
                    locked = true;
                    setTimeout(() => {unlock();}, player.weapon.speed);
                } 
            }

            function unlock() {
                locked = false;
            }

            if (controls[32] && !controls[65] && !controls[87] && !controls[68] && !controls[83]) { //If the player punches
                if (player.weapon.name != "fist") {
                    playerAttack();
                } else {
                    player.weapon.attack(player, map, projectiles, zombie[i]);

                    if (frame > 6) { //If the animation has reached the end
                        frame = 1; //Set the frame to 0
                        frame += 0.02; //Carry on the animation
                    } else { //If animation has nto reached the end
                        frame += 0.02; //Carry on the animation
                    }
                }
            }

            if (!controls[32]) { //If the player stops attacking
                frame = 1; //Set the animation back to the start
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
        
            if (player.fromPosition[0] != player.toPosition[0]) { //If player still needs to move vertically
                player.timeMoved = currentTime(); //Keep track of the time to compare later
            } else if (player.fromPosition[1] != player.toPosition[1]) { //If player still needs to move vertically
                player.timeMoved = currentTime(); //Keep track of the time to compare later
            }
        }
    
        camera.setCamera(player.position[0] + (player.size[0] / 2), player.position[1] + (player.size[1] / 2)); 

        ctx.fillStyle = "#105db0"; 
        ctx.fillRect(0, 0, camera.screen[0], camera.screen[1]); 
        ctx.drawImage(mapImage, (camera.positionX + camera.center[0] * tileWidth) - 40, (camera.positionY + camera.center[1] * tileHeight) - 40); 

        for (let i = 0; i < zombie.length; i++) { //For each zombie
            if (zombie[i].health <= 0) { //If zombie is dead
                let index = zombie.indexOf(zombie[i]); //Find where it is in the list
                if (index > -1) { //When its found
                    if (Math.floor(Math.random() * 11) > 5) { //50% chance to drop a healing heart
                        drops.push(new Drop(10, 0, "../assets/ZombieIsland/game/health.png", zombie[i].position, zombie[i].toPosition)); //Add the drop to the list of drops
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

        for (let i = 0; i < projectiles.length; i++) {
            if (!projectiles[i].updatePosition(currentTime())) {
                if (projectiles[i].direction == "up-right") {
                    projectiles[i].toPosition[0] += 1
                    projectiles[i].toPosition[1] -= 1
                } else if (projectiles[i].direction == "up-left") {
                    projectiles[i].toPosition[0] -= 1
                    projectiles[i].toPosition[1] -= 1
                } else if (projectiles[i].direction == "down-left") {
                    projectiles[i].toPosition[0] -= 1
                    projectiles[i].toPosition[1] += 1
                } else if (projectiles[i].direction == "down-right") {
                    projectiles[i].toPosition[0] += 1
                    projectiles[i].toPosition[1] += 1
                } else if (projectiles[i].direction == "up") {
                    projectiles[i].toPosition[1] -= 1
                } else if (projectiles[i].direction == "down") {
                    projectiles[i].toPosition[1] += 1
                } else if (projectiles[i].direction == "left") {
                    projectiles[i].toPosition[0] -= 1
                } else if (projectiles[i].direction == "right") {
                    projectiles[i].toPosition[0] += 1
                }

                if (projectiles[i].fromPosition[0] != projectiles[i].toPosition[0]) { //If projectiles still needs to move vertically
                    projectiles[i].timeMoved = currentTime(); //Keep track of the time to compare later
                } else if (projectiles[i].fromPosition[1] != projectiles[i].toPosition[1]) { //If projectiles still needs to move horizontally
                    projectiles[i].timeMoved = currentTime(); //Keep track of the time to compare later
                }
            }

            for (let j = 0; j < zombie.length; j++) {
                if ((projectiles[i].position[0] == zombie[j].position[0] && projectiles[i].position[1] == zombie[j].position[1]) ||
                    (projectiles[i].fromPosition[0] == zombie[j].fromPosition[0] && projectiles[i].fromPosition[1] == zombie[j].fromPosition[1]) ||
                    (projectiles[i].toPosition[0] == zombie[j].toPosition[0] && projectiles[i].toPosition[1] == zombie[j].toPosition[1])) {
                    zombie[j].health -= player.weapon.damage;
                }
            }

            const projImage = new Image();
            projImage.src = projectiles[i].image;
            ctx.drawImage(projImage, camera.positionX + projectiles[i].position[0] + 20, camera.positionY + projectiles[i].position[1] + 20);
        }

        for (let i = 0; i < projectiles.length; i++) {
            if (projectiles[i].toPosition[0] <= 0 || projectiles[i].toPosition[1] <= 0 || projectiles[i].toPosition[0] >= 39 || projectiles[i].toPosition[1] >= 39 || map[projectiles[i].toPosition[1]][projectiles[i].toPosition[0]] == 0) {
                let index = projectiles.indexOf(projectiles[i]); 
                if (index > -1) { 
                    projectiles.splice(index, 1);
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
            playerImage.src = "../assets/ZombieIsland/player/punch-" + player.direction + "/punch" + animationImg.toString() + ".png"; //Find the according image for the animation frame
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
        if (controls[82]) { //If user restarts
            window.open("./game.html", "_self") //Reload the page
        } else if (controls[81]) {
            window.open("../index.html", "_self")
        }
    }
    requestAnimationFrame(displayGame); //Recall the game function creatig a loop
}
