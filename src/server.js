const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);
const loadMap = require('./mapLoader');


async function main() {
    
    const map2D = await loadMap();
    
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.emit('map', map2D);
    });
    
    app.use(express.static('public'));
    
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    });
    
    httpServer.listen(3000, () => {
        console.log('listening on *:3000');
    });
}

main();
