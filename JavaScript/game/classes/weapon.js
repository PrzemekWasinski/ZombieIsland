import { Projectile } from "./projectile.js";

export class Weapon {
    constructor(name, damage, type, ammo) {
        this.name = name;
        this.damage = damage;
        this.type = type;
        this.ammo = ammo;
    }

    attack(attacker, map, projectiles, target) {
        const currentTime = Date.now;

        if (this.type == "meelee") {
            if (attacker.direction == "down") {  //If the attacker is facing down
                if (attacker.toPosition[0] == target.toPosition[0] && attacker.toPosition[1] == target.toPosition[1] - 1 || 
                    attacker.toPosition[0] == target.toPosition[0] - 1 && attacker.toPosition[1] == target.toPosition[1] - 1 ||
                    attacker.toPosition[0] == target.toPosition[0] + 1 && attacker.toPosition[1] == target.toPosition[1] - 1) {
                    target.health -= attacker.damage;  //Decrease the health of each targetthin 3 tiles in front of the attacker
                }
            } else if (attacker.direction == "up") { //If the attacker is facing up
                if (attacker.toPosition[0] == target.toPosition[0] && attacker.toPosition[1] == target.toPosition[1] + 1 || 
                    attacker.toPosition[0] == target.toPosition[0] - 1 && attacker.toPosition[1] == target.toPosition[1] + 1 ||
                    attacker.toPosition[0] == target.toPosition[0] + 1 && attacker.toPosition[1] == target.toPosition[1] + 1) {
                    target.health -= attacker.damage; //Decrease the health of each targetthin 3 tiles in front of the attacker
                }
            } else if (attacker.direction == "left") { //If the attacker is facing left
                if (attacker.toPosition[0] == target.toPosition[0] + 1 && attacker.toPosition[1] == target.toPosition[1] || 
                    attacker.toPosition[0] == target.toPosition[0] + 1 && attacker.toPosition[1] == target.toPosition[1] + 1 ||
                    attacker.toPosition[0] == target.toPosition[0] + 1 && attacker.toPosition[1] == target.toPosition[1] - 1) {
                    target.health -= attacker.damage; //Decrease the health of each targetthin 3 tiles in front of the attacker
                }
            } else if (attacker.direction == "right") { //If the attacker is facing right
                if (attacker.toPosition[0] == target.toPosition[0] - 1 && attacker.toPosition[1] == target.toPosition[1] || 
                    attacker.toPosition[0] == target.toPosition[0] - 1 && attacker.toPosition[1] == target.toPosition[1] + 1 ||
                    attacker.toPosition[0] == target.toPosition[0] - 1 && attacker.toPosition[1] == target.toPosition[1] - 1) {
                    target.health -= attacker.damage; //Decrease the health of each targetthin 3 tiles in front of the attacker
                }
            } else if (attacker.direction == "up-right") { //If the attacker is facing up and to the right
                if (attacker.toPosition[0] == target.toPosition[0] && attacker.toPosition[1] == target.toPosition[1] + 1 || 
                    attacker.toPosition[0] == target.toPosition[0] - 1 && attacker.toPosition[1] == target.toPosition[1] ||
                    attacker.toPosition[0] == target.toPosition[0] - 1 && attacker.toPosition[1] == target.toPosition[1] + 1) {
                    target.health -= attacker.damage; //Decrease the health of each targetthin 3 tiles in front of the attacker
                }
            } else if (attacker.direction == "up-left") { //If the attacker is facing up and to the left
                if (attacker.toPosition[0] == target.toPosition[0] && attacker.toPosition[1] == target.toPosition[1] + 1 || 
                    attacker.toPosition[0] == target.toPosition[0] + 1 && attacker.toPosition[1] == target.toPosition[1] ||
                    attacker.toPosition[0] == target.toPosition[0] + 1 && attacker.toPosition[1] == target.toPosition[1] + 1) {
                    target.health -= attacker.damage; //Decrease the health of each targetthin 3 tiles in front of the attacker
                }
            } else if (attacker.direction == "down-right") { //If the attacker is facing down and to the right
                if (attacker.toPosition[0] == target.toPosition[0] - 1 && attacker.toPosition[1] == target.toPosition[1] || 
                    attacker.toPosition[0] == target.toPosition[0] && attacker.toPosition[1] == target.toPosition[1] - 1 ||
                    attacker.toPosition[0] == target.toPosition[0] - 1 && attacker.toPosition[1] == target.toPosition[1] - 1) {
                    target.health -= attacker.damage; //Decrease the health of each targetthin 3 tiles in front of the attacker
                }
            } else if (attacker.direction == "down-left") { //If the attacker is facing down and to the left
                if (attacker.toPosition[0] == target.toPosition[0] && attacker.toPosition[1] == target.toPosition[1] - 1 || 
                    attacker.toPosition[0] == target.toPosition[0] + 1 && attacker.toPosition[1] == target.toPosition[1] ||
                    attacker.toPosition[0] == target.toPosition[0] + 1 && attacker.toPosition[1] == target.toPosition[1] - 1) {
                    target.health -= attacker.damage; //Decrease the health of each targetthin 3 tiles in front of the attacker
                }
            }

            if (attacker.weapon == "fist") {
                if (frame > 6) { //If the animation has reached the end
                    frame = 1; //Set the frame to 0
                    frame += 0.1; //Carry on the animation
                } else { //If animation has nto reached the end
                    frame += 0.1; //Carry on the animation
                }
            }

        } else if (this.type == "range") {
            if (projectiles.length == 0) {
                projectiles.push(new Projectile(currentTime, attacker.direction, 0, [40, 40], [attacker.position[0], attacker.position[1]], [attacker.fromPosition[0], attacker.fromPosition[1]], [attacker.toPosition[0], attacker.toPosition[1]], 40, "../assets/ZombieIsland/game/bullet.png"))
            } else {
                if (projectiles.pop().time == currentTime) {
                    console.log("h")
                    projectiles.push(new Projectile(currentTime, attacker.direction, 0, [40, 40], [attacker.position[0], attacker.position[1]], [attacker.fromPosition[0], attacker.fromPosition[1]], [attacker.toPosition[0], attacker.toPosition[1]], 40, "../assets/ZombieIsland/game/bullet.png"))
                }
            }
        }
    }
}