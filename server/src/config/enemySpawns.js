//Forest, desert, plains, snow

export const enemySpawns = {
    //GHOSTS
    GHOST: {
        enemyAmount: 25,
        biome: "Snow",

        enemyStats: {
            health: [30, 30],
            level: 5,
            speed: 2,
            damage: 3,
            name: "Ghost",
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

    SHADOW_GHOST: {
        enemyAmount: 25,
        biome: "Snow",

        enemyStats: {
            health: [50, 50],
            level: 7,
            speed: 3,
            damage: 4,
            name: "Shadow Ghost",
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

    NIGHT_GHOST: {
        enemyAmount: 25,
        biome: "Snow",

        enemyStats: {
            health: [40, 40],
            level: 6,
            speed: 3,
            damage: 3,
            name: "Night Ghost",
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

    //GOBLINS
    GOBLIN: {
        enemyAmount: 15,
        biome: "Forest",

        enemyStats: {
            health: [10, 10],
            level: 3,
            speed: 2,
            damage: 1,
            name: "Goblin",
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

    SAND_GOBLIN: {
        enemyAmount: 15,
        biome: "Desert",

        enemyStats: {
            health: [15, 15],
            level: 5,
            speed: 3,
            damage: 2,
            name: "Sand Goblin",
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

    SNOW_GOBLIN: {
        enemyAmount: 15,
        biome: "Snow",

        enemyStats: {
            health: [20, 20],
            level: 6,
            speed: 3,
            damage: 3,
            name: "Snow Goblin",
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

    //Golems
    SAND_GOLEM: {
        enemyAmount: 5,
        biome: "Desert",

        enemyStats: {
            health: [100, 100],
            level: 10,
            speed: 1,
            damage: 10,
            name: "Sand Golem",
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

    SNOW_GOLEM: {
        enemyAmount: 5,
        biome: "Snow",

        enemyStats: {
            health: [100, 100],
            level: 10,
            speed: 1,
            damage: 10,
            name: "Snow Golem",
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

    NIGHT_GOLEM: {
        enemyAmount: 5,
        biome: "Plains",

        enemyStats: {
            health: [100, 100],
            level: 10,
            speed: 1,
            damage: 10,
            name: "Night Golem",
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

    //Orcs
    ORC: {
        enemyAmount: 15,
        biome: "Forest",

        enemyStats: {
            health: [30, 30],
            level: 5,
            speed: 2,
            damage: 2,
            name: "Orc",
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

    BLUE_ORC: {
        enemyAmount: 15,
        biome: "Snow",

        enemyStats: {
            health: [40, 40],
            level: 7,
            speed: 3,
            damage: 2,
            name: "Blue Orc",
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

    ORC_WORRIOR: {
        enemyAmount: 15,
        biome: "Snow",

        enemyStats: {
            health: [40, 40],
            level: 7,
            speed: 3,
            damage: 2,
            name: "Blue Orc",
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

    //Skeletons
    SKELETON: {
        enemyAmount: 20,
        biome: "Forest",

        enemyStats: {
            health: [20, 20],
            level: 6,
            speed: 2,
            damage: 4,
            name: "Skeleton",
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

    GOLDEN_SKELETON: {
        enemyAmount: 20,
        biome: "Desert",

        enemyStats: {
            health: [80, 80],
            level: 7,
            speed: 3,
            damage: 4,
            name: "Golden Skeleton",
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

    SKELETON_WORRIOR: {
        enemyAmount: 20,
        biome: "Plains",

        enemyStats: {
            health: [20, 20],
            level: 7,
            speed: 2,
            damage: 5,
            name: "Skeleton Worrior",
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

    //Slimes
    CRYSTAL_SLIME: {
        enemyAmount: 10,
        biome: "Plains",

        enemyStats: {
            health: [20, 20],
            level: 5,
            speed: 2,
            damage: 2,
            name: "Crystal Slime",
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

    ELECTRIC_SLIME: {
        enemyAmount: 10,
        biome: "Desert",

        enemyStats: {
            health: [20, 20],
            level: 5,
            speed: 2,
            damage: 2,
            name: "Electric Slime",
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

    FIRE_SLIME: {
        enemyAmount: 10,
        biome: "Desert",

        enemyStats: {
            health: [20, 20],
            level: 5,
            speed: 2,
            damage: 2,
            name: "Fire Slime",
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

    GHOST_SLIME: {
        enemyAmount: 10,
        biome: "Plains",

        enemyStats: {
            health: [20, 20],
            level: 5,
            speed: 2,
            damage: 2,
            name: "Ghost Slime",
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

    GREEN_SLIME: {
        enemyAmount: 10,
        biome: "Plains",

        enemyStats: {
            health: [20, 20],
            level: 5,
            speed: 2,
            damage: 2,
            name: "Green Slime",
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

    HELL_SLIME: {
        enemyAmount: 10,
        biome: "Desert",

        enemyStats: {
            health: [20, 20],
            level: 5,
            speed: 2,
            damage: 2,
            name: "Hell Slime",
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

    ICE_SLIME: {
        enemyAmount: 10,
        biome: "Snow",

        enemyStats: {
            health: [20, 20],
            level: 5,
            speed: 2,
            damage: 2,
            name: "Ice Slime",
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

    LAVA_SLIME: {
        enemyAmount: 10,
        biome: "Desert",

        enemyStats: {
            health: [20, 20],
            level: 5,
            speed: 2,
            damage: 2,
            name: "Lava Slime",
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

    //Zombies
    ZOMBIE: {
        enemyAmount: 10,
        biome: "Forest",

        enemyStats: {
            health: [20, 20],
            level: 5,
            speed: 2,
            damage: 2,
            name: "Zombie",
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

    NIGHT_ZOMBIE: {
        enemyAmount: 10,
        biome: "Forest",

        enemyStats: {
            health: [40, 40],
            level: 6,
            speed: 3,
            damage: 3,
            name: "Night Zombie",
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

    VIKING_ZOMBIE: {
        enemyAmount: 10,
        biome: "Forest",

        enemyStats: {
            health: [70, 70],
            level: 7,
            speed: 3,
            damage: 3,
            name: "Viking Zombie",
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
}