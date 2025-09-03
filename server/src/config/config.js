import { map } from "./map.js"
import { enemySpawns } from "./enemySpawns.js"
import { objectSpawns } from "./objectSpawns.js"

export const config = {
    MOVE_SPEED: 3,
    TILE_SIZE: 64,
    VISIBLE_TILES_X: 32,
    VISIBLE_TILES_Y: 24,
    PASSABLE_TILES: [0, 1, 2],
    PLAYER_SPAWN: [392, 727],
    ENEMY_SPAWNS: enemySpawns,
    OBJECT_SPAWNS: objectSpawns,
    MAP: map
}