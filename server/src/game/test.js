import { config } from "../config/config.js";

const { ENEMY_SPAWNS } = config;
console.log(ENEMY_SPAWNS[Object.keys(ENEMY_SPAWNS)[0]].enemyAmount)
let locationData = {}
for (let i = 0; i < Object.keys(ENEMY_SPAWNS).length; i++) {
    locationData[Object.keys(ENEMY_SPAWNS)[i]] = 0
}



for (let i = 0; i < Object.keys(ENEMY_SPAWNS).length; i++) {
    let index = Object.keys(ENEMY_SPAWNS)[i]

    while (locationData[index] < ENEMY_SPAWNS[index][2]) {
        locationData[index]++;
    }
}
console.log(locationData)

let x = 5
console.log(-x * 2)