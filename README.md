# Zombie Island

Zombie Island is a real-time multiplayer web game built entirely from scratch. Players share a persistent open world with multiple biomes, players can also fight biome-specific monsters with unique stats and loot, harvest resources from interactable objects, sell items for coins, and buy potions and character upgrades. A global chat keeps the players connected across the map.

# Game Screenshots
<img width="1917" height="946" alt="spawn-point" src="https://github.com/user-attachments/assets/3c6f0a2a-41bc-4ada-8f80-ad6a8381b9c9" />
<img width="1918" height="947" alt="snow" src="https://github.com/user-attachments/assets/04768709-016c-4d89-8bb0-3172a8b923f8" />
<img width="1915" height="942" alt="desert" src="https://github.com/user-attachments/assets/5cebd4b3-f639-43bf-ae88-f600b6976ea3" />

# No Game Engine

Zombie Island was built entirely without a game engine, every system was written from scratch in vanilla JavaScript. The most notable of these is: The client-side prediction system that immediately applies player input locally and smoothly adjusts it when the true position is returned from the server. A delta-time game loop, a tile-based Canvas renderer with a scrolling camera, a layered draw order (water → terrain → objects → players → enemies → UI), frame-based sprite animations, and proximity-based entity culling, all without any external game libraries.

# Behind the Scenes

After signing in, the client connects to a remote server via WebSockets. The server sends real-time game state updates (nearby enemies, objects, map data, and other players), while the client only sends player input such as key presses.

**Example flow:**

```
┌─────────────────────┐
│   Player presses D  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Input sent to the  │
│       server        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Server checks if   │
│  anything is block- │
│    ing the player   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Player position   │
│       updated       │
│   (player[X] += 1)  │
└──────────┬──────────┘
           │
      ┌────┴────┐
      │         │
      ▼         ▼
┌──────────┐ ┌──────────┐
│ New map  │ │ Position │
│ data sent│ │broadcast │
│  to the  │ │  to all  │
│  player  │ │ clients  │
└────┬─────┘ └────┬─────┘
     │            │
     └──────┬─────┘
            │
            ▼
┌─────────────────────┐
│  Every player sees  │
│  the character move │
│    to the right     │
└─────────────────────┘
```

The server manages collision detection and item interactions. For example, when a player's X and Y coordinates are the same as an apple on the ground, the server removes the apple from the world, adds it to the player's inventory, sends the updated inventory only to that player, and broadcasts updated nearby floor items to other players without the apple that was picked up.

The server also manages object and enemy amounts per biome. If the amount of oak trees or zombies or any entity in a biome is less than the designated amount, the server will spawn more in randomised locations around the biome.

# Current Features 

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

Check `/TODO.md` for future improvements.

# Tech Stack
    Frontend: HTML, CSS & JavaScript
    Game Engine: Custom built from scratch
    Authentication: Supabase Auth
    Backend: Node.js
    Connection: WebSocket
    Database: Supabase (PostgreSQL)
