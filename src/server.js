const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = 3000 || process.env.PORT;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);
const loadMap = require('./mapLoader');

const TICK_RATE = 30;
const SPEED = 5;

const inputsMap = {};
let players = [];

function tick() {
    for(const player of players) {
        const inputs = inputsMap[player.id];

        if (inputs.up) {
            player.y -= SPEED;
          } else if (inputs.down) {
            player.y += SPEED;
          }
      
          if (inputs.left) {
            player.x -= SPEED;
          } else if (inputs.right) {
            player.x += SPEED;
        }
    }

    io.emit('players', players);
}




async function main() {
    
    const map2D = await loadMap();
    
    io.on('connection', (socket) => {
        console.log('A user connected');

        players.push({
            id: socket.id,
            x: 0,
            y: 0,
        });

        inputsMap[socket.id] = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        socket.emit('map', map2D);

        socket.on('input', (inputs) => {
            inputsMap[socket.id] = inputs;
        });

        socket.on('disconnect', () => {
            players = players.filter((player) => player.id !== socket.id);
        });
    });
    
    app.use(express.static('public'));
    
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    });
    
    httpServer.listen(PORT, () => {
        console.log('listening on *:3000');
    });

    setInterval(tick, 1000 / TICK_RATE);
}

main();
