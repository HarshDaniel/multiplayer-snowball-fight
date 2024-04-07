const socket = io(`ws://localhost:3000`);

socket.on('connect', () => {
    console.log('Connected to server');
})

socket.on('map', (map) => {
    console.log(map);
})