var board = []
var rows = 8;
var colu = 8;

var minesCount = 5;
var minesLocations = [];

var tilesclicked = 0;
var flagEnable = false;

var gameOver = false;

window.onload = function () {
    startGame();
}

function restartGame() {
    location.reload();
}

function clearBoard() {
    var boardDiv = document.getElementById("board");
    while (boardDiv.firstChild) {
        boardDiv.removeChild(boardDiv.firstChild);
    }
    board = []
}

function setMine() {

    while (minesLocations.length < minesCount) {
        const row = Math.ceil(Math.random() * rows - 1);
        const col = Math.ceil(Math.random() * colu - 1);
        const location = `${row}-${col}`;

        if (!minesLocations.includes(location)) {
            minesLocations.push(location);
        }
    }
}

function startGame() {

    document.getElementById("flag_btn").addEventListener("click", setFlag)

    var selectedOption = document.getElementById("minesOption");
    minesCount = parseInt(selectedOption.value);
    document.getElementById("mines_count").innerText = minesCount;

    clearBoard()

    setMine()

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < colu; c++) {
            //<div id="0-1">
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clicktile)
            document.getElementById("board").append(tile);
            row.push(tile)
        }
        board.push(row);
    }
    console.log(board)
}


function setFlag() {
    if (flagEnable) {
        flagEnable = false;
        document.getElementById("flag_btn").style.backgroundColor = "rgb(233, 233, 233)";
    }
    else {
        flagEnable = true;
        document.getElementById("flag_btn").style.backgroundColor = "rgb(2, 19, 35)";
    }
}

function clicktile() {

    let tile = this;
    if (flagEnable) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
            tile.classList.add("tileflaged")
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";

            tile.classList.remove("tileflaged")
        }
        return;
    }

    if (gameOver || this.classList.contains("tilesclicked") || this.classList.contains("tileflaged")) {
        return
    }
    if (minesLocations.includes(tile.id)) {
        revealMine();
        // alert("GAME OVER");
        gameOver = true;
        return;
    }

    let coords = tile.id.split("-")
    let r = parseInt(coords[0])
    let c = parseInt(coords[1])
    checkMine(r, c)
}

function revealMine() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < colu; c++) {
            let tile = board[r][c]
            if (minesLocations.includes(tile.id)) {
                tile.innerText = "💣"
                tile.style.backgroundColor = "rgb(189, 72, 72)";
            }
        }
    }
}

function checkMine(r, c) {

    if (r < 0 || r >= rows || c < 0 || c >= colu) {
        return
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return
    }
    board[r][c].classList.add("tile-clicked")

    tilesclicked += 1

    let minefound = 0

    //top
    minefound += checktile(r - 1, c - 1) //top left
    minefound += checktile(r - 1, c) //top
    minefound += checktile(r - 1, c + 1) // top right


    //bottom
    minefound += checktile(r + 1, c - 1) //bottom left
    minefound += checktile(r + 1, c) //bottom
    minefound += checktile(r + 1, c + 1) // bottom right

    //left right
    minefound += checktile(r, c - 1) // left
    minefound += checktile(r, c + 1) // right

    if (minefound > 0) {
        board[r][c].innerText = minefound
        board[r][c].classList.add("x" + minefound.toString())
    }
    else {
        //top
        checkMine(r - 1, c - 1) //top left
        checkMine(r - 1, c) //top
        checkMine(r - 1, c + 1) // top right


        //bottom
        checkMine(r + 1, c - 1) //bottom left     
        checkMine(r + 1, c) //bottom
        checkMine(r + 1, c + 1) // bottom right

        //left right
        checkMine(r, c - 1) // left
        checkMine(r, c + 1) // right
    }
    if (tilesclicked == rows * colu - minesCount) {
        document.getElementById("mines_count").innerText = "Cleared"
        gameOver = true
    }
}

function checktile(r, c) {

    if (r < 0 || r >= rows || c < 0 || c >= colu) {
        return 0
    }
    if (minesLocations.includes(r.toString() + "-" + c.toString())) {
        return 1
    }
    return 0
}