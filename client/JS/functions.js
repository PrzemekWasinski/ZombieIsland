import { tileImages, objectImages, playerImages } from "./images.js";

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

export function drawPlayer(player, isCurrentPlayer, currentPlayer, sprite) { //Draw player
    const spritePath = sprite[0];
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

    const spriteSize = 64;
    
    const frameWidth = spriteSize;
    const frameHeight = spriteSize;
    let sourceX = player.frameIndex * frameWidth;
    let sourceY;
    
    if (player.direction == "down" || player.direction == "down-left" || player.direction == "down-right") {
        sourceY = 0
    } else if (player.direction == "up" || player.direction == "up-left" || player.direction == "up-right") {
        sourceY = 1
    } else if (player.direction == "left") {
        sourceY = 2
    } else if (player.direction == "right") {
        sourceY = 3
    }
    sourceY *= frameHeight;


    // Check if image is loaded
    if (!spritePath.complete || spritePath.naturalHeight === 0) {
        console.warn('Image not ready, skipping draw');
        return;
    }

    // Try drawing with error handling
    try {
        if (spriteSize == 128) {
            ctx.drawImage(
                spritePath,
                sourceX, sourceY, frameWidth, frameHeight,
                screenX - 32, screenY - 32, frameWidth, frameHeight
            );
        } else {
            ctx.drawImage(
                spritePath,
                sourceX, sourceY, frameWidth, frameHeight,
                screenX, screenY, frameWidth, frameHeight
            );
        }
        
    } catch (error) {
        console.error('DrawImage failed:', error);
    }

    // Health bar
    const multiplier = healthBarBg.width / player.maxHealth;

    tempRect.x = screenX + healthBarBg.x;
    tempRect.y = screenY + healthBarBg.y;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(tempRect.x, tempRect.y, healthBarBg.width, healthBarBg.height);

    if (player.health > 0) {
        healthBarFg.width = Math.round((player.health * multiplier) - 2);
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
        `${player.username} lv.${player.level}`,
        screenX + 30,
        screenY - 10
    );

    

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
    ctx.fillText(`${player.username} lv.${player.level}`, screenX + 32, screenY - 10)
    
    let space = 0
    for (let i = 0; i < player.messages.length; i++) {
        ctx.fillText(player.messages[i].text, screenX + 32, (screenY - 25) - space)
        space += 15
    }
}

export function drawEnemy(enemy, currentPlayer, sprite) {
    const relativeX = enemy.pixelX - currentPlayer.pixelX;
    const relativeY = enemy.pixelY - currentPlayer.pixelY;
    let screenX = Math.round(halfCanvasWidth - halfTileSize + relativeX);
    let screenY = Math.round(halfCanvasHeight - halfTileSize + relativeY);

    const spritePath = sprite[0];
    const spriteSize = sprite[1];
    
    const frameWidth = spriteSize;
    const frameHeight = spriteSize;
    let sourceX = enemy.frameIndex * frameWidth;
    let sourceY;
    
    if (enemy.direction == "down" || enemy.direction == "down-left" || enemy.direction == "down-right") {
        sourceY = 0
    } else if (enemy.direction == "up" || enemy.direction == "up-left" || enemy.direction == "up-right") {
        sourceY = 1
    } else if (enemy.direction == "left") {
        sourceY = 2
    } else if (enemy.direction == "right") {
        sourceY = 3
    }
    sourceY *= frameHeight;


    // Check if image is loaded
    if (!spritePath.complete || spritePath.naturalHeight === 0) {
        console.warn('Image not ready, skipping draw');
        return;
    }

    // Try drawing with error handling
    try {
        if (spriteSize == 128) {
            ctx.drawImage(
                spritePath,
                sourceX, sourceY, frameWidth, frameHeight,
                screenX - 32, screenY - 32, frameWidth, frameHeight
            );
        } else {
            ctx.drawImage(
                spritePath,
                sourceX, sourceY, frameWidth, frameHeight,
                screenX, screenY, frameWidth, frameHeight
            );
        }
        
    } catch (error) {
        console.error('DrawImage failed:', error);
    }

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
    const img = objectImages[object.name]
    ctx.drawImage(img, screenX - (tileSize), screenY, tileSize, tileSize)
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
	const dx = Math.abs(coord1[0] - coord2[0]);
	const dy = Math.abs(coord1[1] - coord2[1]);
	return dx + dy <= 50;
}

export function drawInventory(inventory) {
    let y = 300
    let x = 300
    let i = 0;

    for (const item in inventory) {
        const currentItem = inventory[item]
        if (currentItem.itemAmount > 0) {
            if (7 == i) { //Make new row
                y += 128;
                x = 300;
            }
            
            ctx.fillStyle = "blue"
            ctx.fillRect(x, y, 64, 64)

            ctx.fillStyle = "white"
            ctx.fillText(`${currentItem.itemName}: ${currentItem.itemAmount}`, x + 32, y + 84);
            currentItem.xPosition = x;
            currentItem.yPosition = y;
            ctx.strokeRect(currentItem.xPosition, currentItem.yPosition, 64, 64);
            x += 128
            i++;
        }
    }
}