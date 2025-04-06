export class Zombie {
    constructor(damage, health, timeMoved, size, position, fromPosition, toPosition, delayMove, images, direction, weapon) {
        this.damage = damage;
        this.health = health;
        this.timeMoved = timeMoved;
        this.size = size;
        this.position = position;
        this.fromPosition = fromPosition;
        this.toPosition = toPosition;
        this.delayMove = delayMove;
        this.images = images;
        this.direction = direction;
        this.weapon = weapon;
    }

    move(x, y) {
        this.fromPosition = [x, y];
        this.toPosition = [x, y];
        this.position = [(x * 40), (y * 40)];
    }

    updatePosition(time) {
        if (this.fromPosition[0] === this.toPosition[0] && this.fromPosition[1] === this.toPosition[1]) {
            return false;
        }

        if ((time - this.timeMoved) >= this.delayMove) {
            this.fromPosition = [...this.toPosition];
            this.position = [(this.fromPosition[0] * 40), (this.fromPosition[1] * 40)];
        } else {
            const progress = (time - this.timeMoved) / this.delayMove;
            
            // Calculate smooth movement between tiles
            const startX = this.fromPosition[0] * 40;
            const startY = this.fromPosition[1] * 40;
            const endX = this.toPosition[0] * 40;
            const endY = this.toPosition[1] * 40;

            this.position[0] = Math.round(startX + (endX - startX) * progress);
            this.position[1] = Math.round(startY + (endY - startY) * progress);
        }
        return true;
    }
}