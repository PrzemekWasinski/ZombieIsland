import { objectDrops } from "./objectDrops.js"

export const objectSpawns = {
    "OBJECTS1": {
        objectAmount: 15,
        topLeft: [358, 501],
        bottomRight: [364, 505],

        objectStats: {
            health: [10, 10],
            name: "Tree",
            possibleDrops: [objectDrops.wood, objectDrops.apple]
        }
    },
}
