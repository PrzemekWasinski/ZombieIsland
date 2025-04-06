import { Zombie } from "./classes/zombie.js";
import { Weapon } from "./classes/weapon.js";

export async function spawnZombies(zombie, spawnCoordinates, tileWidth, tileHeight, map, player, unpassableTiles) {
    try {
        const response = await fetch("https://zombieisland-9e620-default-rtdb.europe-west1.firebasedatabase.app/enemies.json");
        const enemies = await response.json();

        if (enemies) {
            // Create a map of existing zombies for quick lookup
            const existingZombies = new Map();
            zombie.forEach(z => {
                const key = `${z.fromPosition[0]},${z.fromPosition[1]}`;
                existingZombies.set(key, z);
            });

            for (const key in enemies) {
                const enemyData = enemies[key];
                const posKey = `${enemyData.fromPosition[0]},${enemyData.fromPosition[1]}`;

                if (existingZombies.has(posKey)) {
                    // Update existing zombie
                    const existingZombie = existingZombies.get(posKey);
                    
                    // If toPosition has changed, update it and set timeMoved
                    if (existingZombie.toPosition[0] !== enemyData.toPosition[0] || 
                        existingZombie.toPosition[1] !== enemyData.toPosition[1]) {
                        // Keep the current fromPosition and position
                        existingZombie.toPosition = [...enemyData.toPosition];
                        existingZombie.timeMoved = Date.now();
                    }

                    existingZombie.health = enemyData.health;
                    existingZombie.direction = enemyData.direction;
                    existingZombies.delete(posKey);
                } else {
                    // Create new zombie
                    const newZombie = new Zombie(
                        enemyData.damage,
                        enemyData.health,
                        Date.now(),
                        [40, 40],
                        [(enemyData.fromPosition[0] * 40), (enemyData.fromPosition[1] * 40)],
                        [...enemyData.fromPosition],
                        [...enemyData.toPosition],
                        100, // faster movement
                        enemyData.images,
                        enemyData.direction,
                        enemyData.weapon
                    );
                    zombie.push(newZombie);
                }
            }

            // Remove zombies that no longer exist in Firebase
            for (const [key, z] of existingZombies) {
                const index = zombie.indexOf(z);
                if (index > -1) {
                    zombie.splice(index, 1);
                }
            }
        }
    } catch (error) {
        console.error("Failed to fetch enemies from Firebase:", error);
    }
}

export function isOccupied(player, map, zombie, x, y, unpassableTiles) { //Checks if a tile isn't occupied (doesn't have a player / zombie / tree in it)
    if (player.toPosition[0] == y && player.toPosition[1] == x) { //If player is occupying the tile
        return true; //Tile is occupied
    }

    if (unpassableTiles.includes(map[x][y])) { //If tile isn't passable
        return true; //Tile is occupied
    }

    // Only check if zombie is currently at this position, no need to check toPosition
    for (let i = 0; i < zombie.length; i++) {
        if (zombie[i].fromPosition[1] == x && zombie[i].fromPosition[0] == y) {
            return true;
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

export async function saveProgress(player) {
    const user = auth.currentUser;

    if (!user) {
        return;
    }

    try {
        await database.ref('users/' + user.uid).update({
            score: player.score,
            health: player.health, 
            timeMoved: player.timeMoved, 
            size: player.size, 
            position: player.position,
            fromPosition: player.fromPosition, 
            toPosition: player.toPosition, 
            delayMove: player.delayMove, 
            images: player.images,
            direction: player.direction, 
            damage: player.damage, 
            inventory: player.inventory,
            weapon: player.weapon,
            ammo: player.ammo
        });

    } catch (error) {
        console.error("Error saving progress:", error.message);
    }
}
