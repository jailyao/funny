const SPACE = 80;
const SIZE = 10;
const GAME_CANVAS = document.getElementById("game");
let game_context = GAME_CANVAS.getContext("2d");
let GAME_INTERVAL = null;

let game = function() {
    GAME_CANVAS.width = SIZE * SPACE;
    GAME_CANVAS.height = SIZE * SPACE;
    this.cells = generate_cells();
    space();
    
    GAME_CANVAS.addEventListener("mousedown", mouseListener);
};

let mouseListener = function(event) {
    let x = Math.floor(event.pageX / SIZE) - 1;
    let y = Math.floor(event.pageY / SIZE) - 1;
    GAME.cells[x][y] = !GAME.cells[x][y];
    draw_cells();
};

let generate_cells = function() {
    retval = new Array(SPACE);
    for (let i = 0; i < retval.length; i++) {
        retval[i] = new Array(SPACE);
        for (let j = 0; j < retval[i].length; j++) {
            retval[i][j] = 0;
        }
    }
    return retval;
};

let space = function() {
    for (let i = 0; i <= SPACE; i++) {
        game_context.beginPath();
        game_context.moveTo(0, i * SIZE);
        game_context.lineTo(SIZE * SPACE, i * SIZE);
        game_context.moveTo(i * SIZE, 0);
        game_context.lineTo(i * SIZE, SIZE * SPACE);
        game_context.stroke();
    }
};

let draw_cells = function() {
    for (let i = 0; i < SPACE; i++) {
        for (let j = 0; j < SPACE; j++) {
            if (GAME.cells[i][j]) {
                game_context.fillRect(i * SIZE + 1, j * SIZE + 1, SIZE - 2, SIZE - 2);
            } else {
                game_context.clearRect(i * SIZE + 1, j * SIZE + 1, SIZE - 2, SIZE - 2);
            }
        }
    }
};

let count_neighbor = function(x, y) {
    let count = 0;

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i < 0 || i >= SPACE || j < 0 || j >= SPACE || (i == x && j == y))
                continue;
            if (GAME.cells[i][j])
                count++;
        }
    }

    return count;
};

let update = function() {
    let new_cells = JSON.parse(JSON.stringify(GAME.cells));
    for (let i = 0; i < SPACE; i++) {
        for (let j = 0; j < SPACE; j++) {
            // console.log(`cells[i:${i}][j:${j}] = ${GAME.cells[i][j]}\nnew_cells[i:${i}][j:${j}] = ${new_cells[i][j]}`);
            let nearby = count_neighbor(i, j);
            if (nearby < 2 || nearby > 3) 
                new_cells[i][j] = 0;
            else if (nearby == 3)
                new_cells[i][j] = 1;
        }
    }
    GAME.cells = new_cells;
    draw_cells();
};

let start = function() {
    draw_cells();
    GAME_INTERVAL = setInterval(update, 500);
};

let stop = function() {
    clearInterval(GAME_INTERVAL);
};

let step = function() {
    update();
};

GAME = new game();
