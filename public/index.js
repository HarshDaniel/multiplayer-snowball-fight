const mapImage = new Image();
mapImage.src = "assets/snowy-sheet.png";

const santaImage = new Image();
santaImage.src = "assets/santa.png";

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const socket = io(`ws://localhost:3000`);

let map = [[]];
let players = [];

const TILE_SIZE = 16;

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('map', (loadedMap) => {
    map = loadedMap;
})

socket.on('players', (serverPlayers) => {
    players = serverPlayers;
    
})

const inputs = {
    up: false,
    down: false,
    left: false,
    right: false
};

window.addEventListener('keydown', (event) => {
    if (event.key === "w") {
        inputs["up"] = true;
      } else if (event.key === "s") {
        inputs["down"] = true;
      } else if (event.key === "d") {
        inputs["right"] = true;
      } else if (event.key === "a") {
        inputs["left"] = true;
    }

    socket.emit('input', inputs);

});

window.addEventListener('keyup', (event) => {
    if (event.key === "w") {
        inputs["up"] = false;
      } else if (event.key === "s") {
        inputs["down"] = false;
      } else if (event.key === "d") {
        inputs["right"] = false;
      } else if (event.key === "a") {
        inputs["left"] = false;
      }
    socket.emit('input', inputs);
});



function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[0].length; col++) {
            const { id } = map[row][col];
            const imageRow = parseInt(id / TILE_SIZE);
            const imageCol = id % TILE_SIZE;

            ctx.drawImage(
                mapImage,
                imageCol * TILE_SIZE,
                imageRow * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE,
                col * TILE_SIZE,
                row * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
        
    }

    for (const player of players) {
        ctx.drawImage(santaImage, player.x, player.y);
    }
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
