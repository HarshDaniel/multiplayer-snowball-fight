$(document).ready(function() {
    const socket = io.connect('http://localhost:3000');

    socket.on('connect', function() {
        console.log('Connected to server');
    });

    socket.on('map', function(map) {
        console.log(map);
    });
});