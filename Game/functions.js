import { Zombie } from "./classes/zombie.js";
import { Weapon } from "./classes/weapon.js";

export function spawnZombies(zombieAmount, zombie, spawnCoordinates, tileWidth, tileHeight, map) { //A function to spawn zombies
    for (let i = 0; i < zombieAmount; i++) { //For each zombie requested
        let spawn = [spawnCoordinates[Math.floor(Math.random() * spawnCoordinates.length)], spawnCoordinates[Math.floor(Math.random() * spawnCoordinates.length)]]; //Randomly generate spawn coordinates
        let x = spawn[0] / tileWidth; //Get x and y coordinates and divide by the size of each tile so the coordinates can be used on the 2D array
        let y = spawn[1] / tileHeight;
        if (map[y][x] == 1) { //If the spawn coordinate is on a passable tile
            let zombieFromPosition = [spawn[0] / tileHeight, spawn[1] / tileWidth]; //Set the zombie's spawn coordinates
            let zombieToPosition = [spawn[0] / tileHeight, spawn[1] / tileWidth];
            const images = {
                "up": "/Game/assets/zombie/up.png", //A hash table to store the zombie's images for each direction
                "up-right": "/Game/assets/zombie/up-right.png",
                "right": "/Game/assets/zombie/right.png",
                "down-right": "/Game/assets/zombie/down-right.png",
                "down": "/Game/assets/zombie/down.png",
                "down-left": "/Game/assets/zombie/down-left.png",
                "left": "/Game/assets/zombie/left.png",
                "up-left": "/Game/assets/zombie/up-left.png"
            }

            const fist = new Weapon("zombie-fist", 10, "meelee", 0, 0)
            zombie.push(new Zombie(0.03, 100, 0, [tileWidth, tileHeight], spawn, zombieFromPosition, zombieToPosition, 350, images, "up", fist)) //Make a new zombie
        }
    }
}

export function isOccupied(player, map, zombie, x, y) { //Checks if a tile isn't occupied (doesn't have a player / zombie / tree in it)
    if (player.toPosition[0] == y && player.toPosition[1] == x) { //If player is occupying the tile
        return true; //Tile is occupied
    }

    if (map[x][y] == 0) { //If tile isn't passable
        return true; //Tile is occupied
    }

    for (let i = 0; i < zombie.length; i++) { //For every zombie
        if (zombie[i].toPosition[1] == x && zombie[i].toPosition[0] == y) { //If the zombie is occupying the tile
            return true; //Tile is occupied
        }
    }
    return false; //Tile is not occupied
}

export function resetGame(player, round) {
    player.health = 100;
    player.score = 0
    player.ammo = 30
    round = 0
}

export async function saveProgress(gold, level, inventory) {
    const user = auth.currentUser;

    if (!user) {
        return;
    }

    try {
        await database.ref('users/' + user.uid).update({
            gold: gold,
            level: level,
            inventory: inventory
        });

    } catch (error) {
        console.error("Error saving progress:", error.message);
    }
}
