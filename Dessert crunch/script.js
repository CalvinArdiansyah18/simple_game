var cakes = ["1", "2", "3", "4", "5", "6"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;
var timeleft = 60;

var currTile;
var otherTile;

window.onload = function(){
    startGame();
    // Interval untuk memperbarui kue setiap 100ms
    window.setInterval(function(){
        crushCake();
        slideCake();
        generateCake();
    }, 50);
}

window.setInterval(function(){
    updateTime();
}, 1000);


function updateTime() {
    if (timeleft > 0) {
        timeleft--;
        document.getElementById("time").innerText = "Time Left: " + timeleft + "s";

        if (timeleft === 0) {
            endGame(); // Tambahkan ini untuk mengakhiri permainan saat waktu habis
        }
    }
}

function isGameStarted() {
    // Tambahkan logika untuk menentukan apakah permainan sudah dimulai atau belum
    // Misalnya, Anda dapat memeriksa apakah waktu sudah mulai berkurang
    return timeleft < 60; // Contoh: Permainan dianggap dimulai jika waktu telah berkurang dari 60 detik
}

function endGame() {
    // Tambahkan logika yang sesuai untuk mengakhiri permainan di sini
    alert("Game over! Your final score is: " + score);
    // Misalnya, Anda mungkin ingin menghentikan interval dan memunculkan pesan game over
    clearInterval(interval); // Menghentikan interval permainan
}

function randomCake(){
    return cakes[Math.floor(Math.random() * cakes.length)];
}

function startGame(){
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++){
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCake() + ".png";

            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("dragend", dragEnd);
            tile.addEventListener("drop", dragDrop);

            document.getElementById("board").appendChild(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function dragStart(event) {
    currTile = this;
    event.dataTransfer.setData("text", event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function dragEnter(event) {
    event.preventDefault();
}

function dragLeave(event) {
    // No action needed for leave event
}

function dragEnd(event) {
    // No action needed for end event
}

function dragDrop(event) {
    event.preventDefault();
    otherTile = this;
    swapTiles();
}

function swapTiles() {

    if (currTile.src.includes("blank") || otherTile.src.includes("blank")){
        return;
    }

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;

    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

    let validMove = checkValid();
    if (!validMove){
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;
        }
    }
}

function crushCake(){
    crushThree();
    // crushFour();
    // crushFive();
    document.getElementById("score").innerText = score;
}

function crushThree(){
    for (let r = 0; r < rows; r++){
        for (let c = 0; c < columns-2; c++){
            let cake1 = board[r][c];
            let cake2 = board[r][c+1];
            let cake3 = board[r][c+2];
            if (cake1.src == cake2.src && cake2.src == cake3.src && !cake1.src.includes("blank")){
                cake1.src = "./images/blank.png";
                cake2.src = "./images/blank.png";
                cake3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    for (let c = 0; c < columns; c++){
        for (let r = 0; r < rows-2; r++ ){
            let cake1 = board[r][c];
            let cake2 = board[r+1][c];
            let cake3 = board[r+2][c];
            if (cake1.src == cake2.src && cake2.src == cake3.src && !cake1.src.includes("blank")){
                cake1.src = "./images/blank.png";
                cake2.src = "./images/blank.png";
                cake3.src = "./images/blank.png";
                score += 30;
             }
        }
    }
}

function checkValid(){
    for (let r = 0; r < rows; r++){
        for (let c = 0; c < columns-2; c++){
            let cake1 = board[r][c];
            let cake2 = board[r][c+1];
            let cake3 = board[r][c+2];
            if (cake1.src == cake2.src && cake2.src == cake3.src && !cake1.src.includes("blank")){
                return true;
            }
        }
    }

    for (let c = 0; c < columns; c++){
        for (let r = 0; r < rows-2; r++ ){
            let cake1 = board[r][c];
            let cake2 = board[r+1][c];
            let cake3 = board[r+2][c];
            if (cake1.src == cake2.src && cake2.src == cake3.src && !cake1.src.includes("blank")){
                return true;
             }
        }
    }
    return false;
}

function slideCake(){
    for (let c = 0; c < columns; c++){
        let ind = rows - 1;
        for (let r = columns-1; r >= 0; r--){
            if (!board[r][c].src.includes("blank")){
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }
        for(let r = ind; r >= 0; r--){
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCake(){
    for (let c = 0; c < columns; c++){
        if (board[0][c].src.includes("blank")){
            board[0][c].src = "./images/" + randomCake() + ".png";
        }
    }
}

