//This script runs on my RPI4 updating enemy positions and sending them to Firebase

const admin = require('firebase-admin');
const serviceAccount = require('./zombieisland-9e620-firebase-adminsdk-fbsvc-7f62172a60');

//const map = require('./map.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zombieisland-9e620-default-rtdb.europe-west1.firebasedatabase.app/" 
});

const db = admin.database();

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
    this.position = position;         
    this.fromPosition = fromPosition 
    this.toPosition = toPosition    
    this.delayMove = delayMove;
    this.images = images;
    this.direction = direction;
    this.weapon = weapon;
  }

  moveTowards(targetPosition) {
    const distance = calculateDistance(this.fromPosition, targetPosition);
    
    if (distance < 1.5) {
      console.log("Zombie reached player at position", targetPosition);
      return false;
    }

    this.toPosition = [...this.fromPosition];
    
    if (targetPosition[1] < this.fromPosition[1] && targetPosition[0] < this.fromPosition[0]) {
      this.direction = "up-left";
      this.toPosition[0] -= 1;
      this.toPosition[1] -= 1;
    } else if (targetPosition[1] < this.fromPosition[1] && targetPosition[0] > this.fromPosition[0]) {
      this.direction = "up-right";
      this.toPosition[0] += 1;
      this.toPosition[1] -= 1;
    } else if (targetPosition[1] > this.fromPosition[1] && targetPosition[0] < this.fromPosition[0]) {
      this.direction = "down-left";
      this.toPosition[0] -= 1;
      this.toPosition[1] += 1;
    } else if (targetPosition[1] > this.fromPosition[1] && targetPosition[0] > this.fromPosition[0]) {
      this.direction = "down-right";
      this.toPosition[0] += 1;
      this.toPosition[1] += 1;
    } else if (targetPosition[1] < this.fromPosition[1]) {
      this.direction = "up";
      this.toPosition[1] -= 1;
    } else if (targetPosition[1] > this.fromPosition[1]) {
      this.direction = "down";
      this.toPosition[1] += 1;
    } else if (targetPosition[0] < this.fromPosition[0]) {
      this.direction = "left";
      this.toPosition[0] -= 1;
    } else if (targetPosition[0] > this.fromPosition[0]) {
      this.direction = "right";
      this.toPosition[0] += 1;
    }
    
    this.fromPosition = [...this.toPosition];
    
    this.position = [
      this.fromPosition[0] * 40 + ((40 - this.size[0]) / 2),
      this.fromPosition[1] * 40 + ((40 - this.size[1]) / 2)
    ];
    
    return true;
  }

  isNearPlayer(playerGridPosition) {
    const distance = calculateDistance(this.fromPosition, playerGridPosition);
    return distance <= 1.5; 
  }

  dealDamageToPlayer(playerID, db) {
    const playerRef = db.ref('users').child(playerID);
    playerRef.once('value', snapshot => {
      const playerData = snapshot.val();
      if (playerData) {
        if (this.isNearPlayer(playerData.fromPosition)) {
          const playerHealth = playerData.health;
          const newHealth = playerHealth - this.damage;
          playerRef.update({ health: newHealth });
          console.log(`Player ${playerID} took ${this.damage} damage from Zombie at ${this.fromPosition}`);
        }
      }
    });
  }

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

const images = {
  "up": "/Game/assets/zombie/up.png", 
  "up-right": "/Game/assets/zombie/up-right.png",
  "right": "/Game/assets/zombie/right.png",
  "down-right": "/Game/assets/zombie/down-right.png",
  "down": "/Game/assets/zombie/down.png",
  "down-left": "/Game/assets/zombie/down-left.png",
  "left": "/Game/assets/zombie/left.png",
  "up-left": "/Game/assets/zombie/up-left.png"
}

const zombie1 = new Zombie(
  0.03, 100, 0, [40, 40], [600, 600], [600, 600], [600, 600], 350, images, "up", "fist"
);

zombie1.pushToFirebase = function(db, enemyID) {
  const newZombieRef = db.ref('enemies').child(enemyID);
  newZombieRef.set({
    damage: this.damage,
    health: this.health,
    timeMoved: this.timeMoved,
    size: this.size,
    position: this.position,
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

zombie1.pushToFirebase(db, 'zombie_001');

setInterval(() => {
  const zombieRef = db.ref('enemies');
  const playerRef = db.ref('users');
  
  zombieRef.once('value', (snapshot) => {
    const zombies = snapshot.val();
    
    if (zombies) {
      Object.keys(zombies).forEach(enemyID => {
        const zombieData = zombies[enemyID];
        const zombie = new Zombie(
          zombieData.damage, zombieData.health, zombieData.timeMoved, zombieData.size,
          zombieData.position, zombieData.fromPosition, zombieData.toPosition,
          zombieData.delayMove, zombieData.images, zombieData.direction, zombieData.weapon
        );

        playerRef.once('value', (playerSnapshot) => {
          const players = playerSnapshot.val();
          let closestPlayer = null;
          let closestDistance = Infinity;

          Object.keys(players).forEach(playerID => {
            const player = players[playerID];
            const distance = calculateDistance(zombie.fromPosition, player.fromPosition);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestPlayer = playerID;
            }
          });

          if (closestPlayer) {
            const playerData = players[closestPlayer];
            
            if (zombie.isNearPlayer(playerData.fromPosition)) {
              zombie.dealDamageToPlayer(closestPlayer, db);
            } else {
              zombie.moveTowards(playerData.fromPosition);
            }

            zombie.pushToFirebase(db, enemyID);
          }
        });
      });
    }
  });
}, 500); 