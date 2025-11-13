import { tileImages, objectImages, playerImages, itemImages } from "./images.js";

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const tileSize = 64; //Tile size in pixels

const halfCanvasWidth = canvas.width / 2; //Half canvas width
const halfCanvasHeight = canvas.height / 2; //Half canvas height
const halfTileSize = tileSize / 2; //Half tile size

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
            if (currentPlayer.map[y][x] === 0) {
                continue; //Dont draw water tiles
            }

            let img = tileImages[map[y][x]];

            const screenX = Math.round(halfCanvasWidth + (x - centerTileX) * tileSize - modX);
            const screenY = Math.round(halfCanvasHeight + (y - centerTileY) * tileSize - modY);

            if (map[y][x] != 1000 && map[y][x] != 1001) {
                if (img && img.complete) {
                    ctx.drawImage(img, screenX, screenY, tileSize, tileSize);
                }
                continue;
            } else {
                if (map[y][x] == 1000) {
                    ctx.drawImage(tileImages[3], screenX, screenY, tileSize, tileSize);
                    img = objectImages["Wood Chest"]
                    ctx.drawImage(img, screenX, screenY, tileSize, tileSize);
                }

                if (map[y][x] == 1001) {
                    ctx.drawImage(tileImages[3], screenX, screenY, tileSize, tileSize);
                    img = objectImages["Metal Chest"]
                    ctx.drawImage(img, screenX, screenY, tileSize, tileSize);
                }
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
    } else if (player.direction == "left") {
        sourceY = 1
    } else if (player.direction == "right") {
        sourceY = 2
    } else if (player.direction == "up" || player.direction == "up-left" || player.direction == "up-right") {
        sourceY = 3
    }

    if (player.action === "idle" && player.direction === "up") {
        sourceX = 1;
    }

    sourceY *= frameHeight;
    //Check if image is loaded
    if (!spritePath.complete || spritePath.naturalHeight === 0) {
        console.warn('Image not ready, skipping draw');
        return;
    }

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

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
        `${player.username} lv.${player.level}`,
        screenX + 30,
        screenY - 10
    );

    const multiplier = tileSize / player.maxHealth;

    console.log(player.health, player.maxHealth)

    if (player.health > 0) {
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(
            screenX,
            screenY + tileSize,
            player.maxHealth * multiplier,
            10
        );

        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(
            screenX,
            screenY + tileSize,
            player.health * multiplier,
            10
        );
    }
   
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


    //Check if image is loaded
    if (!spritePath.complete || spritePath.naturalHeight === 0) {
        console.warn('Image not ready, skipping draw');
        return;
    }

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
    const multiplier = tileSize / enemy.maxHealth;

    if (enemy.health > 0) {
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(
            screenX,
            screenY + tileSize,
            enemy.maxHealth * multiplier,
            10
        );

        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(
            screenX,
            screenY + tileSize,
            enemy.health * multiplier,
            10
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

    if ( //Skip if off screen
        screenX < -tileSize || screenX > canvas.width ||
        screenY < -tileSize || screenY > canvas.height
    ) {
        return;
    }
    const img = objectImages[object.name]

    // Check if object was recently damaged (flash white)
    const currentTime = Date.now();
    const timeSinceHit = object.lastHitTime ? currentTime - object.lastHitTime : Infinity;
    const flashDuration = 150; // Flash duration in milliseconds

    // Create pulsing effect (normal -> darker -> normal)
    const time = currentTime / 1000; // Convert to seconds
    const pulseSpeed = 2.0; // Speed of the pulse

    // Use sine wave: goes from 1 -> 0 -> 1 (normal -> dark -> normal)
    const brightness = Math.sin(time * pulseSpeed) * 0.5 + 0.5; // Range 0 to 1
    const minBrightness = 0.4; // How dark it gets (0.4 = 60% darker)
    const maxBrightness = 1.0; // Normal brightness

    const darkenAmount = minBrightness + (maxBrightness - minBrightness) * brightness;

    ctx.save();

    // Apply white flash effect if recently hit
    if (timeSinceHit < flashDuration) {
        const flashIntensity = 1 - (timeSinceHit / flashDuration); // Fade out the flash
        // Combine brightness filter with white flash
        const flashBrightness = darkenAmount + (flashIntensity * 2); // Add extra brightness for flash
        ctx.filter = `brightness(${flashBrightness})`;
    } else {
        // Normal pulsing effect
        ctx.filter = `brightness(${darkenAmount})`;
    }

    ctx.drawImage(img, screenX, screenY, tileSize, tileSize);

    ctx.restore();
}

export function drawDrop(drop, currentPlayer) { //Draw drop
    const relativeX = drop.pixelX - currentPlayer.pixelX;
    const relativeY = drop.pixelY - currentPlayer.pixelY;
    const screenX = Math.round(halfCanvasWidth - halfTileSize + relativeX);
    const screenY = Math.round(halfCanvasHeight - halfTileSize + relativeY);

    const img = itemImages[drop.name]
    ctx.drawImage(img, screenX, screenY, tileSize, tileSize)
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
                i = 0;
            }
            const img = itemImages[currentItem.itemName]
            try {
                ctx.drawImage(img, x, y, tileSize, tileSize)
            } catch (error) {
                console.log(item.name, "failed to draw")
            }

            ctx.fillStyle = "white"
            ctx.fillText(`${currentItem.itemName}: ${currentItem.itemAmount}`, x + 32, y + 84);
            currentItem.xPosition = x;
            currentItem.yPosition = y;
            ctx.strokeRect(currentItem.xPosition, currentItem.yPosition, tileSize, tileSize);
            x += 128
            i++;
        }
    }
}

export function drawShopInventory(inventory) {
    let y = 300
    let x = 300
    let i = 0;

    for (const item in inventory) {
        const currentItem = inventory[item]
        if (7 == i) { //Make new row
            y += 128;
            x = 300;
            i = 0;
        }
        // const img = itemImages[currentItem.itemName]
        // try {
        //     ctx.drawImage(img, x, y, tileSize, tileSize)
        // } catch (error) {
        //     console.log(item.name, "failed to draw")
        // }

        ctx.fillStyle = "white"
        ctx.fillText(`${currentItem.itemName}: ${currentItem.itemValue}`, x + 32, y + 84);
        currentItem.xPosition = x;
        currentItem.yPosition = y;
        ctx.strokeRect(currentItem.xPosition, currentItem.yPosition, tileSize, tileSize);
        x += 128
        i++;
        
    }
}

export function drawHUD(player) {
    ctx.fillStyle = "white"
    ctx.textAlign = "left";
    ctx.fillText(`X: ${player.mapX}`, 30, 30);
    ctx.fillText(`Y: ${player.mapY}`, 30, 60);

    ctx.fillText(`Gold: ${player.gold}`, canvas.width - 150, 30);
    ctx.fillText(`HP: ${player.health}/${player.maxHealth}`, canvas.width - 150, 60);
}

export function ensurePlayerDefaults(player) {
    if (!player.action) player.action = "idle";
    if (!player.direction) player.direction = "down";
    if (!player.frameIndex) player.frameIndex = 0;
    if (!player.frameTimer) player.frameTimer = 0;
}