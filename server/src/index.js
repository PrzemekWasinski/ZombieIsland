import { startWebSocket } from './network/server.js';
import { config } from "./config/config.js"

//Start WebSocket server which also starts the game loop
startWebSocket(config);

console.log("Game server started.");