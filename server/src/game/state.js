export let players = {}; // All connected players
export let nextId = 1;   // Next player ID

export let enemies = {}; // All enemies
export let enemyNextID = 1; // Next enemy ID

export let drops = {};
export let dropNextID = 1;

export function getNextId() {
    return nextId++;
}

export function getNextEnemyID() {
    return enemyNextID++;
}

export function getNextDropID() {
    return dropNextID++;
}
