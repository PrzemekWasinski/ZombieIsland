const admin = require('firebase-admin');
const serviceAccount = require('./zombieisland-9e620-firebase-adminsdk-fbsvc-7f62172a60');

//const map = require('./map.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zombieisland-9e620-default-rtdb.europe-west1.firebasedatabase.app/" 
});

const db = admin.database();

// Calculate the Euclidean distance between two positions (in tile coordinates)
function calculateDistance(zombiePosition, playerPosition) {
  const dx = zombiePosition[0] - playerPosition[0];
  const dy = zombiePosition[1] - playerPosition[1];
  return Math.sqrt(dx * dx + dy * dy);
}

class Zombie {
  constructor(damage, health, timeMoved, size, position, fromPosition, toPosition, delayMove, images, direction, weapon) {
    this.damage = damage;
    this.health = health;
    this.timeMoved = timeMoved;
    this.size = size;
    this.position = position;         // Pixel coordinates for drawing (visual position)
    this.fromPosition = fromPosition || [600, 600];  // Current grid position in game's 2D array
    this.toPosition = toPosition || [600, 600];      // Next grid position to move to
    this.delayMove = delayMove;
    this.images = images;
    this.direction = direction;
    this.weapon = weapon;
  }

  // Move the zombie towards a given target position (player position)
  moveTowards(targetPosition) {
    // Calculate the distance between zombie's current grid position and player's grid position
    const distance = calculateDistance(this.fromPosition, targetPosition);
    
    // Stop moving if the zombie has reached the player's grid position
    if (distance < 1.5) {
      console.log("Zombie reached player at position", targetPosition);
      // Stay at current position, don't update movement
      return false;
    }
    
    // Clear the toPosition (next position) before calculating new one
    this.toPosition = [...this.fromPosition];
    
    // Determine direction based on player position
    if (targetPosition[1] < this.fromPosition[1] && targetPosition[0] < this.fromPosition[0]) {
      // Player is above and to the left
      this.direction = "up-left";
      this.toPosition[0] -= 1;
      this.toPosition[1] -= 1;
    } else if (targetPosition[1] < this.fromPosition[1] && targetPosition[0] > this.fromPosition[0]) {
      // Player is above and to the right
      this.direction = "up-right";
      this.toPosition[0] += 1;
      this.toPosition[1] -= 1;
    } else if (targetPosition[1] > this.fromPosition[1] && targetPosition[0] < this.fromPosition[0]) {
      // Player is below and to the left
      this.direction = "down-left";
      this.toPosition[0] -= 1;
      this.toPosition[1] += 1;
    } else if (targetPosition[1] > this.fromPosition[1] && targetPosition[0] > this.fromPosition[0]) {
      // Player is below and to the right
      this.direction = "down-right";
      this.toPosition[0] += 1;
      this.toPosition[1] += 1;
    } else if (targetPosition[1] < this.fromPosition[1]) {
      // Player is directly above
      this.direction = "up";
      this.toPosition[1] -= 1;
    } else if (targetPosition[1] > this.fromPosition[1]) {
      // Player is directly below
      this.direction = "down";
      this.toPosition[1] += 1;
    } else if (targetPosition[0] < this.fromPosition[0]) {
      // Player is directly to the left
      this.direction = "left";
      this.toPosition[0] -= 1;
    } else if (targetPosition[0] > this.fromPosition[0]) {
      // Player is directly to the right
      this.direction = "right";
      this.toPosition[0] += 1;
    }
    
    // Only update the fromPosition after we've completed the move
    // This would typically be done elsewhere in your game loop
    // but we include it here for the Firebase updates
    this.fromPosition = [...this.toPosition];
    
    // Update the pixel position for drawing based on grid coordinates
    this.position = [
      this.fromPosition[0] * 40 + ((40 - this.size[0]) / 2),
      this.fromPosition[1] * 40 + ((40 - this.size[1]) / 2)
    ];
    
    return true; // Zombie has moved
  }

  // Check if the zombie is within attack range of the player
  isNearPlayer(playerGridPosition) {
    // Compare grid positions, not pixel positions
    const distance = calculateDistance(this.fromPosition, playerGridPosition);
    return distance <= 1.5; // Slightly increased threshold to ensure we catch adjacency
  }

  // Deal damage to the player if the zombie is close
  dealDamageToPlayer(playerID, db) {
    const playerRef = db.ref('users').child(playerID);
    playerRef.once('value', snapshot => {
      const playerData = snapshot.val();
      if (playerData) {
        // Use the player's grid position (fromPosition), not pixel position
        if (this.isNearPlayer(playerData.fromPosition)) {
          const playerHealth = playerData.health;
          const newHealth = playerHealth - this.damage;
          playerRef.update({ health: newHealth });
          console.log(`Player ${playerID} took ${this.damage} damage from Zombie at ${this.fromPosition}`);
        }
      }
    });
  }

  // Push zombie data to Firebase
  pushToFirebase(db, enemyID) {
    const newZombieRef = db.ref('enemies').child(enemyID);
    newZombieRef.set({
      damage: this.damage,
      health: this.health,
      timeMoved: this.timeMoved,
      size: this.size,
      position: this.position,
      fromPosition: this.fromPosition,
      toPosition: this.toPosition,
      delayMove: this.delayMove,
      images: this.images,
      direction: this.direction,
      weapon: this.weapon
    }).then(() => {
      console.log(`Zombie ${enemyID} position updated in Firebase`);
    }).catch(err => {
      console.error('Error pushing zombie to Firebase:', err);
    });
  }
}

const zombie1 = new Zombie(
  0.03, 100, 0, [40, 40], [600, 600], [600, 600], [600, 600], 350, ["zombie_walk.png", "zombie_idle.png"], "up", "fist"
);

// Push the zombie to Firebase
zombie1.pushToFirebase = function(db, enemyID) {
  const newZombieRef = db.ref('enemies').child(enemyID);
  newZombieRef.set({
    damage: this.damage,
    health: this.health,
    timeMoved: this.timeMoved,
    size: this.size,
    position: this.position,
    fromPosition: this.fromPosition,
    toPosition: this.toPosition,
    delayMove: this.delayMove,
    images: this.images,
    direction: this.direction,
    weapon: this.weapon
  }).then(() => {
    console.log(`Zombie ${enemyID} added to Firebase`);
  }).catch(err => {
    console.error('Error adding zombie to Firebase:', err);
  });
};

// Push the initial zombie data
zombie1.pushToFirebase(db, 'zombie_001');

// Set an interval to move all zombies every 500ms
setInterval(() => {
  const zombieRef = db.ref('enemies');
  const playerRef = db.ref('users');
  
  zombieRef.once('value', (snapshot) => {
    const zombies = snapshot.val();
    
    if (zombies) {
      // Loop through all zombies
      Object.keys(zombies).forEach(enemyID => {
        const zombieData = zombies[enemyID];
        const zombie = new Zombie(
          zombieData.damage, zombieData.health, zombieData.timeMoved, zombieData.size,
          zombieData.position, zombieData.fromPosition, zombieData.toPosition,
          zombieData.delayMove, zombieData.images, zombieData.direction, zombieData.weapon
        );

        // Find the closest player
        playerRef.once('value', (playerSnapshot) => {
          const players = playerSnapshot.val();
          let closestPlayer = null;
          let closestDistance = Infinity;

          // Loop through all players to find the closest one
          Object.keys(players).forEach(playerID => {
            const player = players[playerID];
            // Compare grid positions, not pixel positions
            const distance = calculateDistance(zombie.fromPosition, player.fromPosition);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestPlayer = playerID;
            }
          });

          // Move zombie towards the closest player
          if (closestPlayer) {
            const playerData = players[closestPlayer];
            
            // Check if near player using grid positions
            if (zombie.isNearPlayer(playerData.fromPosition)) {
              zombie.dealDamageToPlayer(closestPlayer, db);
            } else {
              // Move towards player's grid position
              zombie.moveTowards(playerData.fromPosition);
            }

            // Push updated zombie position to Firebase
            zombie.pushToFirebase(db, enemyID);
          }
        });
      });
    }
  });
}, 500);  // Move zombies every 500ms