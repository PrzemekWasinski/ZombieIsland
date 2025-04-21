const http = require('http');                
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

server.listen(8080, () => {
  console.log('WebSocket server running');
});

let players = {};
let nextId = 1;

function broadcast(data) {
  const msg = JSON.stringify(data);
  for (const client of wss.clients) {         
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}

wss.on('connection', (ws) => {            
  const id = nextId++;
  players[id] = {
    id,
    x: 100,
    y: 100,
    color: '#' + Math.floor(Math.random() * 16777215).toString(16)
  };

  console.log(`Player ${id} connected.`);

  ws.send(JSON.stringify({ type: 'init', id, players }));

  broadcast({ type: 'join', player: players[id] });

  ws.on('message', (message) => {
    const msg = JSON.parse(message);

    if (msg.type === 'move') {
      const p = players[id];
      if (!p) return;

      if (msg.dir === 'up') p.y -= 5;
      else if (msg.dir === 'down') p.y += 5;
      else if (msg.dir === 'left') p.x -= 5;
      else if (msg.dir === 'right') p.x += 5;

      broadcast({ type: 'update', id, x: p.x, y: p.y });
    }
  });

  ws.on('close', () => {
    console.log(`Player ${id} disconnected.`);
    delete players[id];
    broadcast({ type: 'leave', id });
  });
});

console.log('Server');
