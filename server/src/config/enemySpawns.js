export const enemySpawns = {
    WOOD_ENTITY: {
        enemyAmount: 300,
        biome: "Forest",

        enemyStats: {
            health: [30, 30],
            level: 1,
            speed: 1,
            damage: 2,
            name: "Wooden Entity",
            possibleDrops: [
                {
                    name: "Wood",
                    chance: 45
                },
                {
                    name: "Leaf",
                    chance: 70
                }
            ]
        }
    },

    
    // ARMOURED_ZOMBIE: {
    //     enemyAmount: 5,
    //     topLeft: [100, 70],
    //     bottomRight: [1300, 450],

    //     enemyStats: {
    //         health: [100, 100],
    //         level: 7,
    //         speed: 2,
    //         damage: 5,
    //         name: "Armoured Zombie",
    //         possibleDrops: [
    //             {
    //                 name: "Bone",
    //                 chance: 30
    //             },
    //             {
    //                 name: "Iron",
    //                 chance: 10
    //             }
    //         ]
    //     }
    // },
}