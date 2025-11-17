import { map } from "./map.js"
import { enemySpawns } from "./enemySpawns.js"
import { objectSpawns } from "./objectSpawns.js"

//-1 = water
//1155 = snow
//61 = sand
//81 = plains
//12 = forest

export const config = {
    TILE_SIZE: 64,
    VISIBLE_TILES_X: 32,
    VISIBLE_TILES_Y: 24,
    PASSABLE_TILES: [
        1, 2, 3, 4
    ],
    biomes: {
        "Ocean": [0],
        "Desert": [1, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111],
        "Plains": [2, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211],
        "Forest": [3, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311],
        "Snow": [4, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411]
    },
    PLAYER_SPAWN: [1020, 1300],
    ENEMY_SPAWNS: enemySpawns,
    OBJECT_SPAWNS: objectSpawns,
    MAP: map
}