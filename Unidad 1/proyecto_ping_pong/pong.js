//Board Properties
let board;
let boardWidth = 750;
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
    y: boardHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: playerVelocityY,
    color: "#ffffff" // Color inicial
}

let player2 = {
    x: boardWidth - playerWidth - 15,
    y: boardHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: playerVelocityY,
    color: "#ffffff" // Color inicial
}

//ball properties
let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: getRandomOneOrMinusOne(),
    velocityY: 2
}

let player1Score = 0;
let player2Score = 0;
let topBottomColor = "#ffffff"; // Color inicial para los bordes

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    const btnIniciar = document.getElementById("btnIniciar");
    const ventanaInicio = document.getElementById("ventanaInicio");
    const colorPlayer1Input = document.getElementById("colorPlayer1");
    const colorPlayer2Input = document.getElementById("colorPlayer2");
    const colorTopBottomInput = document.getElementById("colorTopBottom");

    // Ocultar el canvas inicialmente
    board.style.display = "none";

    btnIniciar.addEventListener("click", () => {
        ventanaInicio.style.display = "none";
        board.style.display = "block";

        // Obtener los colores seleccionados
        player1.color = colorPlayer1Input.value;
        player2.color = colorPlayer2Input.value;
        topBottomColor = colorTopBottomInput.value;

        // Dibujar los jugadores iniciales con los colores seleccionados
        context.fillStyle = player1.color;
        context.fillRect(player1.x, player1.y, player1.width, player1.height);

        context.fillStyle = player2.color;
        context.fillRect(player2.x, player2.y, player2.width, player2.height);

        // Actualizar los bordes con el color seleccionado
        board.style.borderTopColor = topBottomColor;
        board.style.borderBottomColor = topBottomColor;

        requestAnimationFrame(update);
        document.addEventListener("keyup", movePlayer);
    });
};

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    //update player 1
    context.fillStyle = player1.color;
    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBOunds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    //update player 2
    context.fillStyle = player2.color;
    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBOunds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    //ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //reverse direction in canvas borders
    if (ball.y <= 0 || (ball.y + ball.height) >= boardHeight) ball.velocityY *= -1;

    //check for collisions of the ball with the players
    if (detectCollission(ball, player1)) {
        if (ball.x <= player1.x + player1.width) {
            ball.velocityX *= -1;
        }
    } else if (detectCollission(ball, player2)) {
        if (ball.x + ballWidth >= player2.x) ball.velocityX *= -1;
    }

    //scoring a goal
    if (ball.x < 0) {
        player2Score++;
        resetGame();
    } else if (ball.x + ball.width > board.width) {
        player1Score++;
        resetGame();
    }

    //show scores in screen
    context.font = "50px sans-serif";
    context.fillText(player1Score, boardWidth / 5, 45);
    context.fillText(player2Score, boardWidth * 4 / 5 - 45, 45);

    //division line
    for (let i = 10; i < boardHeight; i += 25) {
        context.fillRect(boardWidth / 2 - 10, i, 5, 5);
    }
}

function movePlayer(e) {
    //player1
    if (e.code == "KeyW") {
        player1.velocityY = -defaultPlayerVelocity;
    } else if (e.code == "KeyS") {
        player1.velocityY = defaultPlayerVelocity;
    }
    //player2
    if (e.code == "ArrowUp") {
        player2.velocityY = -defaultPlayerVelocity;
    } else if (e.code == "ArrowDown") {
        player2.velocityY = defaultPlayerVelocity;
    }
}

function detectCollission(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function outOfBOunds(yPosition) {
    return yPosition < 0 || yPosition + playerHeight > boardHeight;
}

function resetGame() {
    ball = {
        x: boardWidth / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: getRandomOneOrMinusOne(),
        velocityY: 2
    }
}

function getRandomOneOrMinusOne() {
    return Math.random() < 0.5 ? 1 : -1;
}
