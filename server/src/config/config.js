import { map } from "../game/map.js"

//VISIBLE_TILES_X, VISIBLE_TILES_Y, PASSABLE_TILES, PLAYER_SPAWN, ENEMY_SPAWNS, MAP
export const config = {
    MOVE_SPEED: 3,
    TILE_SIZE: 64,
    VISIBLE_TILES_X: 32,
    VISIBLE_TILES_Y: 24,
    PASSABLE_TILES: [6, 7, 8, 9, 13, 22, 23, 24, 25, 27, 28, 29, 38],
    PLAYER_SPAWN: [269, 245],

    ENEMY_SPAWNS: {

        "TEST1": {
            enemyAmount: 15,
            topLeft: [271, 247],
            bottomRight: [280, 256],

            enemyStats: {
                health: [10, 10],
                level: 1,
                speed: 1,
                damage: 1,
                name: "Toxic Slime"
            }
        },
    },

    MAP: map


}