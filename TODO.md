# TODO

### Collision Calculation Optimisation

Store all entities in a second hash table where the key is their coordinates instead of their ID. This will allow for WAY quicker collision calculation in O(1) time instead of the current O(n^2).

---

### Memory Optimisation

Currently the game stores the whole map in memory as a giant 2D array, it might be better to store a smaller 50x50 array for each player and their surroundings and update it while they move.

---

### Asset Update

Currently assets like ground tiles, items, and entities all have different resolutions, need to adjust all assets. After this a lot of assets need to be redesigned as they were rushed such as grass boats and item icons.

---

### GUI Redesign *(maybe)*

The GUI is currently made with HTML canvas shapes which works but can be improved.

---

### More Items & Stores

The game currently features basic items such as healing potions and character updates (speed, health, damage).

---

### Character Progression

Add abilities and upgrade paths.

---

### Mining and Crafting

Add a crafting system to craft weapons, armour and brew potions using items gathered or from mining. Different crafting stations such as furnaces, crafting benches, anvils etc can be used for different purposes.

---

### New Weapons and Armour with Durability

Since weapons will be craftable they should also have durability and will also have different benefits.

---

### Audio

Add sound effects and background music for different biomes.

---

### Building *(maybe)*

Possibly add blocks and workstations that can be carried, picked up and placed down to build temporary camps. (This will require periodic map cleanups). Players will be able to destroy other player's buildings to avoid getting trapped but will not be able to pick them up.

---

### PVP *(maybe)*

Possibly add optional PVP where players can choose to attack/be attacked by others or opt out and play in a passive mode. Will also require 1 minute cooldowns for switching between the 2 modes
