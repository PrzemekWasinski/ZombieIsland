//Biome difficulty: Forest (easiest) → Plains → Desert → Snow (hardest)

export const enemySpawns = {
    //GHOSTS - Snow Biome (Hardest)
    GHOST: {
        enemyAmount: 25,
        biome: "Snow",

        enemyStats: {
            health: [60, 60],
            level: 10,
            speed: 3,
            damage: 5,
            name: "Ghost",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 60,
                    roll: 3,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 40,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    SHADOW_GHOST: {
        enemyAmount: 25,
        biome: "Snow",

        enemyStats: {
            health: [80, 80],
            level: 12,
            speed: 4,
            damage: 6,
            name: "Shadow Ghost",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 65,
                    roll: 3,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 35,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    NIGHT_GHOST: {
        enemyAmount: 25,
        biome: "Snow",

        enemyStats: {
            health: [70, 70],
            level: 11,
            speed: 4,
            damage: 5,
            name: "Night Ghost",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 62,
                    roll: 3,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 38,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    //GOBLINS - Progression across biomes
    GOBLIN: {
        enemyAmount: 15,
        biome: "Forest",

        enemyStats: {
            health: [15, 15],
            level: 2,
            speed: 2,
            damage: 1,
            name: "Goblin",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 30,
                    roll: 1,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 50,
                    roll: 1,

                    health: 10
                }
            ]
        }
    },

    SAND_GOBLIN: {
        enemyAmount: 15,
        biome: "Desert",

        enemyStats: {
            health: [35, 35],
            level: 7,
            speed: 3,
            damage: 4,
            name: "Sand Goblin",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 50,
                    roll: 2,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 40,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    SNOW_GOBLIN: {
        enemyAmount: 15,
        biome: "Snow",

        enemyStats: {
            health: [55, 55],
            level: 10,
            speed: 3,
            damage: 5,
            name: "Snow Goblin",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 58,
                    roll: 3,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 38,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    //GOLEMS - Boss-tier enemies per biome
    NIGHT_GOLEM: {
        enemyAmount: 5,
        biome: "Plains",

        enemyStats: {
            health: [80, 80],
            level: 8,
            speed: 1,
            damage: 6,
            name: "Night Golem",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 55,
                    roll: 3,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 45,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    SAND_GOLEM: {
        enemyAmount: 5,
        biome: "Desert",

        enemyStats: {
            health: [120, 120],
            level: 12,
            speed: 1,
            damage: 8,
            name: "Sand Golem",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 65,
                    roll: 4,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 40,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    SNOW_GOLEM: {
        enemyAmount: 5,
        biome: "Snow",

        enemyStats: {
            health: [150, 150],
            level: 15,
            speed: 1,
            damage: 10,
            name: "Snow Golem",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 75,
                    roll: 5,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 35,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    //ORCS - Mid-tier enemies
    ORC: {
        enemyAmount: 15,
        biome: "Forest",

        enemyStats: {
            health: [25, 25],
            level: 4,
            speed: 2,
            damage: 2,
            name: "Orc",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 35,
                    roll: 2,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 48,
                    roll: 1,

                    health: 10
                }
            ]
        }
    },

    BLUE_ORC: {
        enemyAmount: 15,
        biome: "Snow",

        enemyStats: {
            health: [65, 65],
            level: 11,
            speed: 3,
            damage: 6,
            name: "Blue Orc",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 60,
                    roll: 3,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 38,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    ORC_WORRIOR: {
        enemyAmount: 15,
        biome: "Snow",

        enemyStats: {
            health: [75, 75],
            level: 12,
            speed: 3,
            damage: 7,
            name: "Orc Warrior",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 63,
                    roll: 3,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 36,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    //SKELETONS
    SKELETON: {
        enemyAmount: 20,
        biome: "Forest",

        enemyStats: {
            health: [20, 20],
            level: 3,
            speed: 2,
            damage: 2,
            name: "Skeleton",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 32,
                    roll: 2,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 48,
                    roll: 1,

                    health: 10
                }
            ]
        }
    },

    SKELETON_WORRIOR: {
        enemyAmount: 20,
        biome: "Plains",

        enemyStats: {
            health: [35, 35],
            level: 6,
            speed: 2,
            damage: 3,
            name: "Skeleton Warrior",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 45,
                    roll: 2,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 42,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    GOLDEN_SKELETON: {
        enemyAmount: 20,
        biome: "Desert",

        enemyStats: {
            health: [50, 50],
            level: 9,
            speed: 3,
            damage: 5,
            name: "Golden Skeleton",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 70,
                    roll: 4,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 35,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    //SLIMES - Low-tier enemies across biomes
    CRYSTAL_SLIME: {
        enemyAmount: 10,
        biome: "Plains",

        enemyStats: {
            health: [25, 25],
            level: 4,
            speed: 2,
            damage: 2,
            name: "Crystal Slime",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 40,
                    roll: 2,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 45,
                    roll: 1,

                    health: 10
                }
            ]
        }
    },

    GREEN_SLIME: {
        enemyAmount: 10,
        biome: "Plains",

        enemyStats: {
            health: [28, 28],
            level: 5,
            speed: 2,
            damage: 2,
            name: "Green Slime",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 42,
                    roll: 2,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 44,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    GHOST_SLIME: {
        enemyAmount: 10,
        biome: "Plains",

        enemyStats: {
            health: [30, 30],
            level: 5,
            speed: 3,
            damage: 2,
            name: "Ghost Slime",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 43,
                    roll: 2,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 43,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    ELECTRIC_SLIME: {
        enemyAmount: 10,
        biome: "Desert",

        enemyStats: {
            health: [40, 40],
            level: 8,
            speed: 3,
            damage: 4,
            name: "Electric Slime",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 52,
                    roll: 2,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 40,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    FIRE_SLIME: {
        enemyAmount: 10,
        biome: "Desert",

        enemyStats: {
            health: [42, 42],
            level: 8,
            speed: 2,
            damage: 4,
            name: "Fire Slime",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 53,
                    roll: 2,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 39,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    HELL_SLIME: {
        enemyAmount: 10,
        biome: "Desert",

        enemyStats: {
            health: [45, 45],
            level: 9,
            speed: 3,
            damage: 5,
            name: "Hell Slime",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 55,
                    roll: 3,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 38,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    LAVA_SLIME: {
        enemyAmount: 10,
        biome: "Desert",

        enemyStats: {
            health: [48, 48],
            level: 9,
            speed: 2,
            damage: 5,
            name: "Lava Slime",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 56,
                    roll: 3,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 37,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    ICE_SLIME: {
        enemyAmount: 10,
        biome: "Snow",

        enemyStats: {
            health: [60, 60],
            level: 11,
            speed: 3,
            damage: 6,
            name: "Ice Slime",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 62,
                    roll: 3,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 36,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },

    //ZOMBIES - Forest Biome (Easiest)
    ZOMBIE: {
        enemyAmount: 10,
        biome: "Forest",

        enemyStats: {
            health: [18, 18],
            level: 2,
            speed: 1,
            damage: 1,
            name: "Zombie",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 28,
                    roll: 1,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 52,
                    roll: 1,

                    health: 10
                }
            ]
        }
    },

    NIGHT_ZOMBIE: {
        enemyAmount: 10,
        biome: "Forest",

        enemyStats: {
            health: [28, 28],
            level: 4,
            speed: 2,
            damage: 2,
            name: "Night Zombie",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 36,
                    roll: 2,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 47,
                    roll: 1,

                    health: 10
                }
            ]
        }
    },

    VIKING_ZOMBIE: {
        enemyAmount: 10,
        biome: "Forest",

        enemyStats: {
            health: [35, 35],
            level: 5,
            speed: 2,
            damage: 3,
            name: "Viking Zombie",
            possibleDrops: [
                {
                    name: "Gold",
                    chance: 38,
                    roll: 2,

                    amount: 10
                },
                {
                    name: "Heart",
                    chance: 46,
                    roll: 2,

                    health: 10
                }
            ]
        }
    },
}