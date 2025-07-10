import { map } from "../game/map.js"

export const config = {
    MOVE_SPEED: 3,
    TILE_SIZE: 64,
    VISIBLE_TILES_X: 32,
    VISIBLE_TILES_Y: 24,
    PASSABLE_TILES: [32, 33, 34, 37],
    PLAYER_SPAWN: [355, 491],

    ENEMY_SPAWNS: {

        "TEST1": {
            enemyAmount: 15,
            topLeft: [358, 501],
            bottomRight: [364, 505],

            enemyStats: {
                health: [10, 10],
                level: 1,
                speed: 1,
                damage: 1,
                name: "Green Slime"
            }
        },

        "TEST2": {
            enemyAmount: 15,
            topLeft: [307, 491],
            bottomRight: [316, 500],

            enemyStats: {
                health: [20, 20],
                level: 1,
                speed: 1,
                damage: 1,
                name: "Toxic Slime"
            }
        },

        "TEST3": {
            enemyAmount: 15,
            topLeft: [295, 466],
            bottomRight: [305, 475],

            enemyStats: {
                health: [20, 20],
                level: 3,
                speed: 1,
                damage: 2,
                name: "Magma Slime"
            }
        },

        "TEST4": {
            enemyAmount: 15,
            topLeft: [306, 438],
            bottomRight: [314, 445],

            enemyStats: {
                health: [40, 40],
                level: 5,
                speed: 2,
                damage: 3,
                name: "Toxic Slime"
            }
        },

        "TEST5": {
            enemyAmount: 15,
            topLeft: [264, 449],
            bottomRight: [274, 457],

            enemyStats: {
                health: [50, 50],
                level: 6,
                speed: 5,
                damage: 1,
                name: "Green Slime"
            }
        },

        "TEST6": {
            enemyAmount: 15,
            topLeft: [266, 476],
            bottomRight: [276, 485],

            enemyStats: {
                health: [60, 60],
                level: 7,
                speed: 2,
                damage: 5,
                name: "Toxic Slime"
            }
        },

        "TEST7": {
            enemyAmount: 15,
            topLeft: [274, 506],
            bottomRight: [289, 521],

            enemyStats: {
                health: [100, 100],
                level: 10,
                speed: 5,
                damage: 5,
                name: "Magma Slime"
            }
        },
    },

    MAP: map


}