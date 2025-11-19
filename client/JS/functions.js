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

                if (map[y][x] === 98) {
                    img = objectImages["Oak Tree"]
                    ctx.drawImage(img, screenX, screenY, tileSize, tileSize);
                } else if (map[y][x] === 99) {
                    img = objectImages["Fruit Tree"]
                    ctx.drawImage(img, screenX, screenY, tileSize, tileSize);
                }
                continue;
            } else {
                if (map[y][x] == 1000) {
                    ctx.drawImage(tileImages[3], screenX, screenY, tileSize, tileSize);
                    img = objectImages["Sell Chest"]
                    ctx.drawImage(img, screenX, screenY, tileSize, tileSize);
                }

                if (map[y][x] == 1001) {
                    ctx.drawImage(tileImages[3], screenX, screenY, tileSize, tileSize);
                    img = objectImages["Upgrades Chest"]
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

    //Only show username and messages for current player, no health bar
    if (!isCurrentPlayer) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            `${player.username} lv.${player.level}`,
            screenX + 30,
            screenY - 10
        );

        const multiplier = tileSize / player.maxHealth;

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
    }

    // Show messages for all players (filter out old messages)
    const currentTime = Date.now();
    const MESSAGE_LIFETIME = 5000; // 5 seconds - match server lifetime
    const activeMessages = player.messages.filter(msg =>
        currentTime - msg.timestamp < MESSAGE_LIFETIME
    );

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    let space = 0;
    for (let i = 0; i < activeMessages.length; i++) {
        ctx.fillText(activeMessages[i].text, screenX + 32, (screenY - 40) - space);
        space += 15;
    }

    // Show typing indicator
    if (player.isTyping && !isCurrentPlayer) {
        const typingY = (screenY - 40) - space;
        const dotSize = 3;
        const dotSpacing = 5;
        const animationSpeed = 500; // ms per animation cycle
        const time = Date.now() % animationSpeed;
        const animationProgress = time / animationSpeed;

        // Draw "..." with bouncing animation
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        for (let i = 0; i < 3; i++) {
            const dotX = screenX + 32 + (i - 1) * (dotSize * 2 + dotSpacing);
            const bounce = Math.abs(Math.sin((animationProgress + i * 0.33) * Math.PI * 2)) * 3;
            ctx.beginPath();
            ctx.arc(dotX, typingY - bounce, dotSize, 0, Math.PI * 2);
            ctx.fill();
        }
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
    // Inventory panel settings
    const panelWidth = 960;
    const panelHeight = 600;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2;

    // Draw main panel background
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    // Draw panel border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // Draw title bar
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(panelX, panelY, panelWidth, 50);
    ctx.strokeRect(panelX, panelY, panelWidth, 50);

    // Title text
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Inventory", panelX + panelWidth / 2, panelY + 35);

    // Item grid settings - calculate to fit evenly
    const itemSize = 80;
    const itemsPerRow = 8;
    const gridPadding = 40; // Padding on left and right
    const totalGridWidth = panelWidth - (gridPadding * 2);
    const itemSpacing = (totalGridWidth - (itemsPerRow * itemSize)) / (itemsPerRow - 1);
    const startX = panelX + gridPadding;
    const startY = panelY + 80;
    const rowSpacing = 30; // Space for item name below

    let row = 0;
    let col = 0;

    for (const item in inventory) {
        const currentItem = inventory[item];
        if (currentItem.itemAmount > 0) {
            const x = startX + col * (itemSize + itemSpacing);
            const y = startY + row * (itemSize + itemSpacing + rowSpacing);

            // Draw item slot background
            ctx.fillStyle = "rgba(50, 50, 50, 0.6)";
            ctx.fillRect(x, y, itemSize, itemSize);

            // Draw item slot border
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, itemSize, itemSize);

            // Draw item image
            const img = itemImages[currentItem.itemName];
            try {
                ctx.drawImage(img, x + 8, y + 8, itemSize - 16, itemSize - 16);
            } catch (error) {
                console.log(currentItem.itemName, "failed to draw");
            }

            // Draw item quantity in bottom-right corner
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            ctx.fillRect(x + itemSize - 28, y + itemSize - 22, 26, 20);

            ctx.fillStyle = "white";
            ctx.font = "bold 14px Arial";
            ctx.textAlign = "right";
            ctx.fillText(currentItem.itemAmount, x + itemSize - 4, y + itemSize - 6);

            // Draw item name below slot
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.fillText(currentItem.itemName, x + itemSize / 2, y + itemSize + 18);

            // Store position for click detection
            currentItem.xPosition = x;
            currentItem.yPosition = y;

            col++;
            if (col >= itemsPerRow) {
                col = 0;
                row++;
            }
        }
    }
}

export function drawShopInventory(inventory, playerSpeed, playerDamage, playerMaxHealth) {
    // Shop panel settings
    const panelWidth = 960;
    const panelHeight = 600;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2;

    // Draw main panel background
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    // Draw panel border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // Draw title bar
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(panelX, panelY, panelWidth, 50);
    ctx.strokeRect(panelX, panelY, panelWidth, 50);

    // Title text
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Shop", panelX + panelWidth / 2, panelY + 35);

    // Item grid settings - calculate to fit evenly
    const itemSize = 80;
    const itemsPerRow = 8;
    const gridPadding = 40; // Padding on left and right
    const totalGridWidth = panelWidth - (gridPadding * 2);
    const itemSpacing = (totalGridWidth - (itemsPerRow * itemSize)) / (itemsPerRow - 1);
    const startX = panelX + gridPadding;
    const startY = panelY + 80;
    const rowSpacing = 30; // Space for item name below

    let row = 0;
    let col = 0;

    for (const item in inventory) {
        const currentItem = inventory[item];
        const x = startX + col * (itemSize + itemSpacing);
        const y = startY + row * (itemSize + itemSpacing + rowSpacing);

        // Draw item slot background
        ctx.fillStyle = "rgba(50, 50, 50, 0.6)";
        ctx.fillRect(x, y, itemSize, itemSize);

        // Draw item slot border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, itemSize, itemSize);

        // Draw item image
        const img = itemImages[currentItem.itemName];
        try {
            ctx.drawImage(img, x + 8, y + 8, itemSize - 16, itemSize - 16);
        } catch (error) {
            console.log(currentItem.itemName, error);
        }

        // Draw price in bottom-right corner with gold background
        if (currentItem.itemName === "Speed Upgrade" && playerSpeed === 10) {
            const priceText = `No Stock`;
            ctx.font = "bold 14px Arial";
            const priceWidth = ctx.measureText(priceText).width + 8;

            ctx.fillStyle = "rgba(218, 44, 32, 0.9)"; // Gold background
            ctx.fillRect(x + itemSize - priceWidth - 2, y + itemSize - 22, priceWidth + 2, 20);

            ctx.fillStyle = "black";
            ctx.textAlign = "right";
            ctx.fillText(priceText, x + itemSize - 4, y + itemSize - 6);
        } else {
            const priceText = `${currentItem.itemValue} G`;
            ctx.font = "bold 14px Arial";
            const priceWidth = ctx.measureText(priceText).width + 8;

            ctx.fillStyle = "rgba(218, 165, 32, 0.9)"; // Gold background
            ctx.fillRect(x + itemSize - priceWidth - 2, y + itemSize - 22, priceWidth + 2, 20);

            ctx.fillStyle = "black";
            ctx.textAlign = "right";
            ctx.fillText(priceText, x + itemSize - 4, y + itemSize - 6);
        }

        // Draw item name below slot
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";

        if (currentItem.itemName === "Speed Upgrade") {
            ctx.fillText(`+ Speed: ${playerSpeed}`, x + itemSize / 2, y + itemSize + 18);
        } else if (currentItem.itemName === "Sword Upgrade") {
            ctx.fillText(`+ Damage: ${playerDamage}`, x + itemSize / 2, y + itemSize + 18);
        } else if (currentItem.itemName === "Health Upgrade") {
            ctx.fillText(`+ Max Health: ${playerMaxHealth}`, x + itemSize / 2, y + itemSize + 18);
        } else {
            ctx.fillText(currentItem.itemName, x + itemSize / 2, y + itemSize + 18);
        }


        // Store position for click detection
        currentItem.xPosition = x;
        currentItem.yPosition = y;

        col++;
        if (col >= itemsPerRow) {
            col = 0;
            row++;
        }
    }
}

export function drawHUD(player) {
    const padding = 20;
    const hudWidth = 350;
    const hudHeight = 140;
    const barWidth = 280;
    const barHeight = 30;

    // Draw semi-transparent dark background panel (top-left)
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(padding, padding, hudWidth, hudHeight);

    // Draw border around panel
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, padding, hudWidth, hudHeight);

    // Player name and level
    ctx.fillStyle = "#FFD700"; // Gold color
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`${player.username} - Lv.${player.level}`, padding + 15, padding + 30);

    // Health bar background
    const healthBarX = padding + 15;
    const healthBarY = padding + 45;
    ctx.fillStyle = "rgba(50, 50, 50, 0.8)";
    ctx.fillRect(healthBarX, healthBarY, barWidth, barHeight);

    // Health bar fill
    const healthPercent = player.health / player.maxHealth;
    const healthColor = healthPercent > 0.5 ? "#4CAF50" : healthPercent > 0.25 ? "#FFA500" : "#F44336";
    ctx.fillStyle = healthColor;
    ctx.fillRect(healthBarX, healthBarY, barWidth * healthPercent, barHeight);

    // Health bar border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(healthBarX, healthBarY, barWidth, barHeight);

    // Health text
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`HP: ${Math.floor(player.health)}/${player.maxHealth}`, healthBarX + barWidth / 2, healthBarY + 20);

    // Gold and coordinates
    ctx.textAlign = "left";
    ctx.font = "18px Arial";
    ctx.fillStyle = "#FFD700";
    ctx.fillText(`Gold: ${player.gold}`, padding + 15, padding + 100);

    ctx.fillStyle = "white";
    ctx.fillText(`X: ${player.mapX}`, padding + 15, padding + 120);
    ctx.fillText(`Y: ${player.mapY}`, padding + 90, padding + 120);
}

export function drawChatBox(messages, isTyping, currentMessage) {
    const chatWidth = 450;
    const chatHeight = 250;
    const chatX = 20;
    const inputBoxHeight = isTyping ? 40 : 0; // Account for input box if typing
    const chatY = canvas.height - chatHeight - inputBoxHeight - 40; // Move higher with more padding
    const lineHeight = 20;
    const messagePadding = 10;
    const maxMessages = 10;

    // Draw chat box background
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(chatX, chatY, chatWidth, chatHeight);

    // Draw chat box border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(chatX, chatY, chatWidth, chatHeight);

    // Draw title bar
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(chatX, chatY, chatWidth, 30);
    ctx.strokeRect(chatX, chatY, chatWidth, 30);

    // Title text
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Chat", chatX + 10, chatY + 20);

    // Draw X button in the top-right corner of the title bar
    const closeButtonSize = 24;
    const closeButtonX = chatX + chatWidth - closeButtonSize - 3;
    const closeButtonY = chatY + 3;

    // Draw close button background
    ctx.fillStyle = "rgba(220, 53, 69, 0.8)";
    ctx.fillRect(closeButtonX, closeButtonY, closeButtonSize, closeButtonSize);

    // Draw close button border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.strokeRect(closeButtonX, closeButtonY, closeButtonSize, closeButtonSize);

    // Draw X
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    const padding = 6;
    ctx.beginPath();
    ctx.moveTo(closeButtonX + padding, closeButtonY + padding);
    ctx.lineTo(closeButtonX + closeButtonSize - padding, closeButtonY + closeButtonSize - padding);
    ctx.moveTo(closeButtonX + closeButtonSize - padding, closeButtonY + padding);
    ctx.lineTo(closeButtonX + padding, closeButtonY + closeButtonSize - padding);
    ctx.stroke();

    // Draw messages
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    const startY = chatY + 45;
    const displayMessages = messages.slice(-maxMessages);

    for (let i = 0; i < displayMessages.length; i++) {
        const msg = displayMessages[i];
        const y = startY + i * lineHeight;

        // Draw username in color
        ctx.fillStyle = "#c64affff";
        const usernameText = `${msg.username}: `;
        ctx.fillText(usernameText, chatX + messagePadding, y);

        // Draw message in white
        const usernameWidth = ctx.measureText(usernameText).width;
        ctx.fillStyle = "white";

        // Truncate message if too long
        const maxMessageWidth = chatWidth - messagePadding * 2 - usernameWidth;
        let messageText = msg.text;
        if (ctx.measureText(messageText).width > maxMessageWidth) {
            while (ctx.measureText(messageText + "...").width > maxMessageWidth && messageText.length > 0) {
                messageText = messageText.slice(0, -1);
            }
            messageText += "...";
        }

        ctx.fillText(messageText, chatX + messagePadding + usernameWidth, y);
    }

    // Draw typing indicator box if typing
    if (isTyping) {
        const inputBoxHeight = 35;
        const inputBoxY = chatY + chatHeight + 5;

        // Draw input box background
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(chatX, inputBoxY, chatWidth, inputBoxHeight);

        // Draw input box border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.strokeRect(chatX, inputBoxY, chatWidth, inputBoxHeight);

        // Draw current message being typed
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "left";

        // Add cursor animation
        const cursorVisible = Math.floor(Date.now() / 500) % 2 === 0;
        const displayText = currentMessage + (cursorVisible ? "|" : "");

        // Truncate if too long
        let finalText = displayText;
        const maxInputWidth = chatWidth - messagePadding * 2;
        if (ctx.measureText(finalText).width > maxInputWidth) {
            // Show end of message if it's too long
            while (ctx.measureText("..." + finalText).width > maxInputWidth && finalText.length > 0) {
                finalText = finalText.slice(1);
            }
            finalText = "..." + finalText;
        }

        ctx.fillText(finalText, chatX + messagePadding, inputBoxY + 22);
    }

    // Return close button bounds for click detection
    return {
        closeButtonX,
        closeButtonY,
        closeButtonSize
    };
}

export function drawChatToggleButton() {
    const buttonSize = 50;
    const buttonX = 20;
    const buttonY = canvas.height - buttonSize - 20;

    // Draw button background (matching HUD style)
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(buttonX, buttonY, buttonSize, buttonSize);

    // Draw button border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonSize, buttonSize);

    // Draw three dots
    ctx.fillStyle = "#FFD700"; // Gold color like HUD
    const dotSize = 5;
    const dotSpacing = 12;
    const startX = buttonX + buttonSize / 2;
    const startY = buttonY + buttonSize / 2;

    // Draw three horizontal dots
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(startX + (i * dotSpacing), startY, dotSize, 0, Math.PI * 2);
        ctx.fill();
    }

    // Return button bounds for click detection
    return {
        buttonX,
        buttonY,
        buttonSize
    };
}

export function drawMinimap(player, mapImage, isVisible) {
    const hudPadding = 20; // Same padding as HUD

    if (!isVisible) {
        // Draw toggle button when minimap is closed (top right)
        const buttonSize = 50;
        const buttonX = canvas.width - buttonSize - hudPadding;
        const buttonY = hudPadding;

        // Draw button background (matching HUD style)
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(buttonX, buttonY, buttonSize, buttonSize);

        // Draw button border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonSize, buttonSize);

        // Draw "M" for map
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("M", buttonX + buttonSize / 2, buttonY + buttonSize / 2);

        return {
            toggleButtonX: buttonX,
            toggleButtonY: buttonY,
            toggleButtonSize: buttonSize
        };
    }

    // Minimap dimensions (top right, aligned with HUD)
    const minimapWidth = 250;
    const minimapHeight = 175;
    const titleBarHeight = 30;
    const minimapX = canvas.width - minimapWidth - hudPadding;
    // Adjust minimapY so the top of the panel (including title bar) aligns with HUD
    const minimapY = hudPadding + titleBarHeight + 5; // +5 for the border offset

    // Draw minimap background (panel starts at hudPadding)
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(minimapX - 5, hudPadding, minimapWidth + 10, minimapHeight + 40);

    // Draw minimap border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(minimapX - 5, hudPadding, minimapWidth + 10, minimapHeight + 40);

    // Draw title bar
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(minimapX - 5, hudPadding, minimapWidth + 10, titleBarHeight);

    // Title text
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Map", minimapX, hudPadding + 20);

    // Draw close button
    const closeButtonSize = 24;
    const closeButtonX = minimapX + minimapWidth - closeButtonSize + 5;
    const closeButtonY = hudPadding + 3;

    ctx.fillStyle = "rgba(220, 53, 69, 0.8)";
    ctx.fillRect(closeButtonX, closeButtonY, closeButtonSize, closeButtonSize);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.strokeRect(closeButtonX, closeButtonY, closeButtonSize, closeButtonSize);

    // Draw X
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    const padding = 6;
    ctx.beginPath();
    ctx.moveTo(closeButtonX + padding, closeButtonY + padding);
    ctx.lineTo(closeButtonX + closeButtonSize - padding, closeButtonY + closeButtonSize - padding);
    ctx.moveTo(closeButtonX + closeButtonSize - padding, closeButtonY + padding);
    ctx.lineTo(closeButtonX + padding, closeButtonY + closeButtonSize - padding);
    ctx.stroke();

    // Draw map image
    if (mapImage && mapImage.complete) {
        ctx.drawImage(mapImage, minimapX, minimapY, minimapWidth, minimapHeight);
    }

    // Calculate player position on minimap
    // Map is 2500x1750 tiles, image is 500x350 pixels, minimap is 250x175
    const mapTilesWidth = 2500;
    const mapTilesHeight = 1750;

    const playerMinimapX = minimapX + (player.mapX / mapTilesWidth) * minimapWidth;
    const playerMinimapY = minimapY + (player.mapY / mapTilesHeight) * minimapHeight;

    // Draw player indicator (pulsing dot)
    const time = Date.now() / 1000;
    const pulseSize = 3 + Math.sin(time * 4) * 1.5;

    // Outer glow
    ctx.fillStyle = "rgba(255, 215, 0, 0.4)";
    ctx.beginPath();
    ctx.arc(playerMinimapX, playerMinimapY, pulseSize + 3, 0, Math.PI * 2);
    ctx.fill();

    // Player dot
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(playerMinimapX, playerMinimapY, pulseSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw border around player dot
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    ctx.lineWidth = 1;
    ctx.stroke();

    return {
        closeButtonX,
        closeButtonY,
        closeButtonSize
    };
}

export function ensurePlayerDefaults(player) {
    if (!player.action) player.action = "idle";
    if (!player.direction) player.direction = "down";
    if (!player.frameIndex) player.frameIndex = 0;
    if (!player.frameTimer) player.frameTimer = 0;
}

export function drawPickupNotifications(notifications) {
    const currentTime = Date.now();
    const notificationDuration = 3000; // Show for 3 seconds
    const fadeOutStart = 2000; // Start fading after 2 seconds
    const startX = canvas.width - 250; // Right side
    const notificationHeight = 40;
    const notificationSpacing = 10;
    const bottomMargin = 20;

    // Filter out expired notifications
    const activeNotifications = notifications.filter(notif =>
        currentTime - notif.timestamp < notificationDuration
    );

    // Draw notifications from bottom to top, with newest at the bottom
    activeNotifications.forEach((notif, index) => {
        const age = currentTime - notif.timestamp;
        // Calculate position from bottom up, reverse index so newest is at bottom
        const reverseIndex = activeNotifications.length - 1 - index;
        const y = canvas.height - bottomMargin - (reverseIndex + 1) * (notificationHeight + notificationSpacing);

        // Calculate opacity for fade out effect
        let opacity = 1;
        if (age > fadeOutStart) {
            opacity = 1 - ((age - fadeOutStart) / (notificationDuration - fadeOutStart));
        }

        // Draw notification background
        ctx.fillStyle = `rgba(0, 150, 0, ${opacity * 0.85})`;
        ctx.fillRect(startX, y, 230, notificationHeight);

        // Draw border
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, y, 230, notificationHeight);

        // Draw text
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`+ ${notif.amount} ${notif.itemName}`, startX + 10, y + 25);
    });

    // Remove expired notifications from the array
    while (notifications.length > 0 && currentTime - notifications[0].timestamp >= notificationDuration) {
        notifications.shift();
    }
}