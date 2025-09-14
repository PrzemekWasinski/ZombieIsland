

export const enemySpawns = {
    WOOD_ENTITY: {
        enemyAmount: 5,
        topLeft: [170, 650],
        bottomRight: [600, 800],

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

    LEAF_ENTITY: {
        enemyAmount: 5,
        topLeft: [100, 370],
        bottomRight: [300, 650],

        enemyStats: {
            health: [50, 50],
            level: 2,
            speed: 2,
            damage: 2,
            name: "Leaf Entity",
            possibleDrops: [
                {
                    name: "Wood",
                    chance: 60
                },
                {
                    name: "Leaf",
                    chance: 100
                },
                {
                    name: "Apple",
                    chance: 20
                }
            ]
        }
    },

    FOREST_ENTITY: {
        enemyAmount: 5,
        topLeft: [100, 370],
        bottomRight: [300, 530],

        enemyStats: {
            health: [70, 70],
            level: 4,
            speed: 3,
            damage: 3,
            name: "Forest Entity",
            possibleDrops: [
                {
                    name: "Wood",
                    chance: 80
                },
                {
                    name: "Leaf",
                    chance: 100
                },
                {
                    name: "Apple",
                    chance: 40
                },
                {
                    name: "Nature's Apple",
                    chance: 3
                }
            ]
        }
    },

    SAND_GOLEM: {
        enemyAmount: 5,
        topLeft: [200, 770],
        bottomRight: [630, 870],

        enemyStats: {
            health: [200, 200],
            level: 6,
            speed: 1,
            damage: 5,
            name: "Sand Golem",
            possibleDrops: [
                {
                    name: "Rock",
                    chance: 50
                },
                {
                    name: "Sand",
                    chance: 70
                },
                {
                    name: "Coal",
                    chance: 20
                }
            ]
        }
    },

    SNOW_GOLEM: {
        enemyAmount: 5,
        topLeft: [340, 70],
        bottomRight: [930, 310],

        enemyStats: {
            health: [300, 300],
            level: 10,
            speed: 2,
            damage: 8,
            name: "Snow Golem",
            possibleDrops: [
                {
                    name: "Rock",
                    chance: 80
                },
                {
                    name: "Ice",
                    chance: 70
                },
                {
                    name: "Ice Crystal",
                    chance: 10
                }
            ]
        }
    },

    NIGHT_GOLEM: {
        enemyAmount: 5,
        topLeft: [1120, 460],
        bottomRight: [1330, 750],

        enemyStats: {
            health: [500, 500],
            level: 15,
            speed: 3,
            damage: 13,
            name: "Night Golem",
            possibleDrops: [
                {
                    name: "Rock",
                    chance: 100
                },
                {
                    name: "Night Stone",
                    chance: 10
                }
            ]
        }
    },

    SHROOM_SPIDER: {
        enemyAmount: 8,
        topLeft: [190, 670],
        bottomRight: [600, 790],

        enemyStats: {
            health: [20, 20],
            level: 1,
            speed: 2,
            damage: 1,
            name: "Shroom Spider",
            possibleDrops: [
                {
                    name: "Brown Mushroom",
                    chance: 50
                }
            ]
        }
    },

    RED_SHROOM_SPIDER: {
        enemyAmount: 8,
        topLeft: [190, 670],
        bottomRight: [600, 790],

        enemyStats: {
            health: [20, 20],
            level: 2,
            speed: 2,
            damage: 2,
            name: "Red Shroom Spider",
            possibleDrops: [
                {
                    name: "Red Mushroom",
                    chance: 50
                }
            ]
        }
    },
    NIGHT_SHROOM_SPIDER: {
        enemyAmount: 8,
        topLeft: [100, 370],
        bottomRight: [300, 660],

        enemyStats: {
            health: [40, 40],
            level: 4,
            speed: 3,
            damage: 3,
            name: "Night Shroom Spider",
            possibleDrops: [
                {
                    name: "Night Mushrrom",
                    chance: 50
                }
            ]
        }
    },

    ORC: {
        enemyAmount: 5,
        topLeft: [160, 640],
        bottomRight: [300, 700],

        enemyStats: {
            health: [100, 100],
            level: 5,
            speed: 2,
            damage: 3,
            name: "Orc",
            possibleDrops: [
                {
                    name: "Bone",
                    chance: 40
                },
                {
                    name: "Orc Flesh",
                    chance: 30
                }
            ]
        }
    },

    GINGER_ORC: {
        enemyAmount: 3,
        topLeft: [450, 670],
        bottomRight: [560, 780],

        enemyStats: {
            health: [150, 150],
            level: 7,
            speed: 4,
            damage: 3,
            name: "Ginger Orc",
            possibleDrops: [
                {
                    name: "Bone",
                    chance: 60
                },
                {
                    name: "Orc Flesh",
                    chance: 50
                }
            ]
        }
    },

    SKELETON: {
        enemyAmount: 5,
        topLeft: [1140, 660],
        bottomRight: [1230, 750],

        enemyStats: {
            health: [50, 50],
            level: 5,
            speed: 4,
            damage: 2,
            name: "Skeleton",
            possibleDrops: [
                {
                    name: "Bone",
                    chance: 80
                }
            ]
        }
    },

    GOLDEN_SKELETON: {
        enemyAmount: 3,
        topLeft: [610, 770],
        bottomRight: [1300, 900],

        enemyStats: {
            health: [100, 100],
            level: 7,
            speed: 4,
            damage: 4,
            name: "Golden Skeleton",
            possibleDrops: [
                {
                    name: "Bone",
                    chance: 80
                },
                {
                    name: "Gold",
                    chance: 20
                }
            ]
        }
    },

    BLUE_SLIM1: {
        enemyAmount: 8,
        topLeft: [170, 630],
        bottomRight: [600, 800],

        enemyStats: {
            health: [20, 20],
            level: 1,
            speed: 1,
            damage: 1,
            name: "Blue Slime",
            possibleDrops: [
                {
                    name: "Blue Slime Ball",
                    chance: 80
                }
            ]
        }
    },
    BLUE_SLIME_2: {
        enemyAmount: 8,
        topLeft: [1110, 460],
        bottomRight: [1330, 750],

        enemyStats: {
            health: [20, 20],
            level: 1,
            speed: 1,
            damage: 1,
            name: "Blue Slime",
            possibleDrops: [
                {
                    name: "Blue Slime Ball",
                    chance: 80
                }
            ]
        }
    },
    ICE_SLIME: {
        enemyAmount: 8,
        topLeft: [130, 40],
        bottomRight: [1300, 480],

        enemyStats: {
            health: [50, 50],
            level: 3,
            speed: 1,
            damage: 2,
            name: "Ice Slime",
            possibleDrops: [
                {
                    name: "Ice Slime Ball",
                    chance: 80
                }
            ]
        }
    },

    ELECTRIC_SLIME: {
        enemyAmount: 8,
        topLeft: [200, 770],
        bottomRight: [1300, 900],

        enemyStats: {
            health: [40, 40],
            level: 3,
            speed: 2,
            damage: 2,
            name: "Electric Slime",
            possibleDrops: [
                {
                    name: "Electric Slime Ball",
                    chance: 80
                }
            ]
        }
    },
    ZOMBIE: {
        enemyAmount: 8,
        topLeft: [170, 650],
        bottomRight: [600, 770],

        enemyStats: {
            health: [50, 50],
            level: 3,
            speed: 1,
            damage: 2,
            name: "Zombie",
            possibleDrops: [
                {
                    name: "Flesh",
                    chance: 80
                },
                {
                    name: "Bone",
                    chance: 30
                }
            ]
        }
    },
    TOXIC_ZOMBIE: {
        enemyAmount: 8,
        topLeft: [1130, 470],
        bottomRight: [1300, 750],

        enemyStats: {
            health: [50, 50],
            level: 5,
            speed: 1,
            damage: 5,
            name: "Toxic Zombie",
            possibleDrops: [
                {
                    name: "Flesh",
                    chance: 80
                },
                {
                    name: "Bone",
                    chance: 30
                },
                {
                    name: "Toxic Breath",
                    chance: 10
                }
            ]
        }
    },
    ARMOURED_ZOMBIE: {
        enemyAmount: 5,
        topLeft: [100, 70],
        bottomRight: [1300, 450],

        enemyStats: {
            health: [100, 100],
            level: 7,
            speed: 2,
            damage: 5,
            name: "Armoured Zombie",
            possibleDrops: [
                {
                    name: "Flesh",
                    chance: 80
                },
                {
                    name: "Bone",
                    chance: 30
                },
                {
                    name: "Iron",
                    chance: 10
                }
            ]
        }
    },
}