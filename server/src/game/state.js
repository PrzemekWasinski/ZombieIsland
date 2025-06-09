export let players = {}; //All connected players
export let nextId = 1; //Next player ID

export let enemies = {}; //All enemies
export let enemyNextID = 1 //Next enemy ID

export function getNextId() {
	return nextId++;
}

export function getNextEnemyID() {
	enemyNextID++;
	return enemyNextID++;
}