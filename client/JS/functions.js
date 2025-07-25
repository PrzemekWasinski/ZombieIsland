import { tileImages } from "./images.js";

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const tileSize = 64; //Tile size in pixels

const halfCanvasWidth = canvas.width / 2; //Half canvas width
const halfCanvasHeight = canvas.height / 2; //Half canvas height
const halfTileSize = tileSize / 2; //Half tile size

const tempRect = { x: 0, y: 0, width: tileSize, height: tileSize }; //Reusable rect
const healthBarBg = { x: 6, y: 65, width: 50, height: 10 }; //Health bar bg
const healthBarFg = { x: 7, y: 66, width: 0, height: 8 }; //Health bar fg

export function drawMap(currentPlayer) { //Draw game map
    if (!currentPlayer.map) {
        return;
    }

    const map = currentPlayer.map;
    const pixelX = currentPlayer.pixelX;
    const pixelY = currentPlayer.pixelY;
    const centerTileX = Math.floor(map[0].length / 2);
    const centerTileY = Math.floor(map.length / 2);
    const modX = pixelX % tileSize;
    const modY = pixelY % tileSize;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {

            const img = tileImages[map[y][x]];
            if (img && img.complete) {
                const screenX = Math.round(halfCanvasWidth + (x - centerTileX) * tileSize - modX);
                const screenY = Math.round(halfCanvasHeight + (y - centerTileY) * tileSize - modY);

                ctx.drawImage(img, screenX, screenY, tileSize, tileSize);
            }
        }
    }
}

export function drawPlayer(player, isCurrentPlayer, currentPlayer) { //Draw player
    let screenX, screenY;
    if (isCurrentPlayer) { //You
        screenX = Math.round((canvas.width - tileSize) / 2);
        screenY = Math.round((canvas.height - tileSize) / 2);
    } else { //Other players
        const relativeX = player.pixelX - currentPlayer.pixelX;
        const relativeY = player.pixelY - currentPlayer.pixelY;
        screenX = Math.round(halfCanvasWidth - halfTileSize + relativeX);
        screenY = Math.round(halfCanvasHeight - halfTileSize + relativeY);

        if ( //Skip if off-screen
            screenX < -tileSize || screenX > canvas.width ||
            screenY < -tileSize || screenY > canvas.height
        ) {
            return;
        }
    }

    ctx.fillStyle = "white"
    ctx.fillRect(screenX, screenY, tileSize, tileSize);

    tempRect.x = screenX + healthBarBg.x;
    tempRect.y = screenY + healthBarBg.y;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(tempRect.x, tempRect.y, healthBarBg.width, healthBarBg.height);

    if (player.health > 0) { //Fill in health bar with player health
        healthBarFg.width = Math.round(player.health / 2) - 2;
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(
            screenX + healthBarFg.x,
            screenY + healthBarFg.y,
            healthBarFg.width,
            healthBarFg.height
        );
    }

    ctx.fillStyle = "rgb(255, 255, 255)" //Write player name and level
    ctx.font = "18px Arial";
    ctx.textAlign = "center"
    ctx.fillText(`${player.username} lv.${player.level}`, screenX + 30, screenY - 10)
}

export function drawEnemy(enemy, currentPlayer, sprite) {
    const relativeX = enemy.pixelX - currentPlayer.pixelX;
    const relativeY = enemy.pixelY - currentPlayer.pixelY;
    const screenX = Math.round(halfCanvasWidth - halfTileSize + relativeX);
    const screenY = Math.round(halfCanvasHeight - halfTileSize + relativeY);

    // Draw the sprite (replace green box); 
    const frameWidth = 64;
    const frameHeight = 64;

    const sourceX = enemy.frameIndex * frameWidth;
    const sourceY = 0; // top row only for now

    ctx.drawImage(
        sprite,
        sourceX, sourceY, frameWidth, frameHeight,
        screenX, screenY, frameWidth, frameHeight
    );

    // Health bar
    const multiplier = healthBarBg.width / enemy.maxHealth;

    tempRect.x = screenX + healthBarBg.x;
    tempRect.y = screenY + healthBarBg.y;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(tempRect.x, tempRect.y, healthBarBg.width, healthBarBg.height);

    if (enemy.health > 0) {
        healthBarFg.width = Math.round((enemy.health * multiplier) - 2);
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(
            screenX + healthBarFg.x,
            screenY + healthBarFg.y,
            healthBarFg.width,
            healthBarFg.height
        );
    }

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
        `${enemy.name} lv.${enemy.level} ${enemy.health}/${enemy.maxHealth}`,
        screenX + 30,
        screenY - 10
    );
}

export function drawObject(object, currentPlayer) {
    let screenX, screenY;
    const relativeX = object.pixelX - currentPlayer.pixelX;
    const relativeY = object.pixelY - currentPlayer.pixelY;
    screenX = Math.round(halfCanvasWidth - halfTileSize + relativeX);
    screenY = Math.round(halfCanvasHeight - halfTileSize + relativeY);

    if ( //Skip if off-screen
        screenX < -tileSize || screenX > canvas.width ||
        screenY < -tileSize || screenY > canvas.height
    ) {
        return;
    }

    ctx.fillStyle = "green"
    ctx.fillRect(screenX, screenY, tileSize, tileSize);

    // tempRect.x = screenX + healthBarBg.x;
    // tempRect.y = screenY + healthBarBg.y;
    // ctx.fillStyle = "rgb(0, 0, 0)";
    // ctx.fillRect(tempRect.x, tempRect.y, healthBarBg.width, healthBarBg.height);

    // if (object.health > 0) { //Fill in health bar with player health
    //   healthBarFg.width = Math.round(object.health / 2) - 2;
    //   ctx.fillStyle = "rgb(255, 0, 0)";
    //   ctx.fillRect(
    //     screenX + healthBarFg.x,
    //     screenY + healthBarFg.y,
    //     healthBarFg.width,
    //     healthBarFg.height
    //   );
    // }
}

export function drawDrop(drop, currentPlayer) { //Draw drop
    const relativeX = drop.pixelX - currentPlayer.pixelX;
    const relativeY = drop.pixelY - currentPlayer.pixelY;
    const screenX = Math.round(halfCanvasWidth - halfTileSize + relativeX);
    const screenY = Math.round(halfCanvasHeight - halfTileSize + relativeY);

    ctx.fillStyle = 'blue';
    ctx.fillRect(screenX, screenY, tileSize, tileSize);
}

export function isNearby(coord1, coord2) {
    const dx = coord1[0] - coord2[0]; // X-axis difference
    const dy = coord1[1] - coord2[1]; // Y-axis difference
    return dx * dx + dy * dy <= 2500; // 50squares
}
