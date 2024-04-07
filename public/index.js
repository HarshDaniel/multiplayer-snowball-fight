const mapImage = new Image();
mapImage.src = "assets/snowy-sheet.png";

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const socket = io(`ws://localhost:3000`);

let map = [[]];

const TILE_SIZE = 16;

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('map', (loadedMap) => {
    map = loadedMap;
})

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
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
