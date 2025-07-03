import { startWebSocket } from './network/server.js';
import { config } from "./config/config.js";
import "dotenv/config";

//Start WebSocket server which also starts the game loop
startWebSocket(config, process.env.URL, process.env.API_KEY);

console.log("Game server started.");