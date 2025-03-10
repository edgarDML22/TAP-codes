//Board Properties
let board;
let boardWidth = 600;
let boardHeight = 500;
let context;

//players
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;
let defaultPlayerVelocity = 2.5;
let ballWidth = 10;
let ballHeight = 10;

let player1 = {
    x: 15,
    y: boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : playerVelocityY
}

let player2 = {
    x: boardWidth - playerWidth - 15,
    y: boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : playerVelocityY 
}

//ball properties
let ball = {
    x : boardWidth / 2,
    y : boardHeight / 2,
    width : ballWidth,
    height : ballHeight,
    velocityX : getRandomOneOrMinusOne(),
    velocityY : 2
}

let player1Score = 0;
let player2Score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    const btnIniciar = document.getElementById("btnIniciar");
    const ventanaInicio = document.getElementById("ventanaInicio");

    // Ocultar el canvas inicialmente
    board.style.display = "none";

    btnIniciar.addEventListener("click", () => {
        ventanaInicio.style.display = "none";
        board.style.display = "block";

        // Dibujar los jugadores iniciales aquí, después de que se inicia el juego
        context.fillStyle = "red";
        context.fillRect(player1.x, player1.y, player1.width, player1.height);

        context.fillStyle = "skyblue";
        context.fillRect(player2.x, player2.y, player2.width, player2.height);

        requestAnimationFrame(update);
        document.addEventListener("keyup", movePlayer);
    });
};

//Choose the color of your bar


function update(){
    requestAnimationFrame(update)
    context.clearRect(0, 0, board.width, board.height)
    //update player 1
    context.fillStyle = "red";
    // player1.y += player1.velocityY;
    let nextPlayer1Y = player1.y + player1.velocityY;
    if(!outOfBOunds(nextPlayer1Y)){
        player1.y = nextPlayer1Y;
    }
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    //update player 2
    context.fillStyle = "skyblue";
    // player2.y += player2.velocityY;
    let nextPlayer2Y = player2.y + player2.velocityY;
    if(!outOfBOunds(nextPlayer2Y)){
        player2.y = nextPlayer2Y;
    }
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    //ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height)

    //reverse direction in canvas borders
    if(ball.y <= 0 || (ball.y + ball.height) >= boardHeight) ball.velocityY *= -1;

    //check for collisions of the ball with the players
    if (detectCollission(ball, player1)){
        if(ball.x <= player1.x + player1.width){
            //left side of the ball touches player 1 ritgh side
            ball.velocityX *= -1;
        }
    }
    else if(detectCollission(ball, player2)){
        if(ball.x + ballWidth >= player2.x)
        //right side of the ball touches player 2 left side
        ball.velocityX *= -1;
    }

    //scoring a goal
    if(ball.x < 0) {
        player2Score ++;
        resetGame();
    }
    else if (ball.x + ball.width > board.width) {
        player1Score ++;
        resetGame();
    }

    //show scores in screen
    context.font = "50px sans-serif";
    context.fillText(player1Score, boardWidth/5, 45);
    context.fillText(player2Score, boardWidth*4/5 -45, 45);

    //division line
    for(let i = 10; i < boardHeight; i += 25){
        context.fillRect(boardWidth/2 - 10, i, 5, 5)
    }
}

function movePlayer(e){
    //player1
    if (e.code == "KeyW"){
        player1.velocityY = -defaultPlayerVelocity;
    }
    else if(e.code == "KeyS"){
        player1.velocityY = defaultPlayerVelocity;
    }
    //player2
    if (e.code == "ArrowUp"){
        player2.velocityY = -defaultPlayerVelocity;
    }
    else if (e.code == "ArrowDown"){
        player2.velocityY = defaultPlayerVelocity;
    }
}

function detectCollission(a, b){
    return a.x < b.x + b.width && //a's top lef corner doesn't reach b's top right corner
    a.x + a.width > b.x && // a's top right corner passes b's top left corner
    a.y < b.y + b.height && // a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y; //a's bottom left corner passes b's top left corner   
}

function outOfBOunds(yPosition){
    return (yPosition < 0 || yPosition + playerHeight > boardHeight)
}

function resetGame(){
    ball = {
        x : boardWidth / 2,
        y : boardHeight / 2,
        width : ballWidth,
        height : ballHeight,
        velocityX : getRandomOneOrMinusOne(),
        velocityY : 2
    }
}

function getRandomOneOrMinusOne() {
    return Math.random() < 0.5 ? 1 : -1;
}
