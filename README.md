# Zombie Island
Zombie Island an in progress Online Web Game. The game features a massive shared online world where players can trade and chat, explore, fight enemies, destroy objects, collect and sell items for coins in order to buy potions
or upgrades for their character.

Beyond the spawn point the map is filled with interactable objects (trees, rocks, bushes) which players can destroy to get items, these items can be used for healing or to sell for coins. Monsters also roam the map,
they are randomly spawned on their designated biome with unique speeds, damage, health and drops. 

# Behind the scenes
After signing in, the client connects to a remote server via WebSockets. The server sends real-time game state updates (nearby enemies, objects, map data, and other players), while the client only sends player input such as key presses.

Example flow: the player presses A → the input is sent to the server → the server checks if there's anything blocking the player → updates the player’s position → broadcasts the new position to all connected clients and new map data to the player that moved 
-> Every player sees the character move to the left.

The server manages collision detection and item interactions. For example, when a player’s X and Y coordinates are the same as an Apple on the ground, the server removes the apple from the world, adds it to the player’s inventory, sends the updated inventory only to that player, and broadcasts updated nearby floor items to other players without the apple that was picked up. 

The server also manages object and enemy amounts per biome, if the amount of Oak Trees or Zombies any entity in a biome is less than the designated amount the server will spawn more in randomised locations around the biome.

# Game Screenshots
<img width="1917" height="946" alt="spawn-point" src="https://github.com/user-attachments/assets/3c6f0a2a-41bc-4ada-8f80-ad6a8381b9c9" />
<img width="1918" height="947" alt="snow" src="https://github.com/user-attachments/assets/04768709-016c-4d89-8bb0-3172a8b923f8" />
<img width="1915" height="942" alt="desert" src="https://github.com/user-attachments/assets/5cebd4b3-f639-43bf-ae88-f600b6976ea3" />

# Current features:
- Player login & register
- Saving progress
- Multiplayer!
- Combat with enemies
- Enemy moving and attacking logic
- Enemy item drops
- Boats 
- Randomly generated objects
- Destroying objects
- Object drops
- Player chat
- Inventory management
- Selling items
- Buying upgrades and other items
- Healing mechanics
- Dropping items for trading/sharing

# Tech Stack
    Frontend: HTML, CSS & JavaScript
    Authentication: Supabase Auth
    Backend: Node.js
    Connection: Websocket
    Database: SupaBase (PostgreSQL)

