const canvas = document.getElementById("myCanvas");
const scoreElement = document.getElementById("score");
const lifesElement = document.getElementById("lifes");
const buttonReset = document.createElement("button");
let score = 0;
let lifes = 5;

const ctx = canvas.getContext("2d");
let x = canvas.width/2; 
let y = canvas.height-50;
let newX = 1;
let newY = -1;

const ballRadius = 6;

const paddleHeight = 5;
const paddleWidth = 60;
let paddleX = (canvas.width-paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 35;
const brickHeight = 5;
const brickPadding = 5;
const brickOffsetTop = 5;
const brickOffsetLeft = 14; 

drawLifes();
drawScore();

const options = ['#DC3E31', '#E59209', '#EFEE0A','#99EF0A', '#38EF0A', '#0AEF9E',, '#0AEDEF', '#A30AEF', '#EF0AE1', '#EF0A6E', '#EF0A0A'];
let bricks = [];
for(let column=0; column<brickColumnCount; column++) {
    bricks[column] = [];
    for(let row=0; row<brickRowCount; row++) {
        bricks[column][row] = { x: 0, y: 0, status: 1};
    }
}
    
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(let column=0; column<brickColumnCount; column++) {
        for(let row=0; row<brickRowCount; row++) {
            let brick = bricks[column][row];
            if(brick.status == 1){
                if(x > brick.x && x < brick.x+brickWidth && y > brick.y && y < brick.y+brickHeight) {
                    newY = -newY;
                    brick.status = 0;
                    score++;
                    drawScore();
                    if(score == brickRowCount*brickColumnCount) {
                        ctx.fillStyle = "white";
                        ctx.font = "40px Verdana";
                        ctx.stroke();
                        setInterval(ctx.fillText("YOU WIN!", canvas.width /5.5, (canvas.height/2)-30));
                        clearInterval(interval);
                        drawButton();
                    }
                }
            }
        }
    }
}

function drawScore(){
    scoreElement.textContent = "Score: " + score;
}

function drawLifes(){
    lifesElement.innerHTML = "";
    for(let i = 0; i < lifes; i++){
        const img = document.createElement('img'); 
        img.src = "img/heart-992.png";
        img.style.backgroundColor = "#1182E2";
        lifesElement.appendChild(img);
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0*Math.PI, 2*Math.PI); //rysowanie kółka
    ctx.fillStyle = "#0221D3";
    ctx.fill(); //uzupełnienie koloru
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#976B2B";
    ctx.fill();
    ctx.closePath();
}

function createBubbles(){
    const section = document.querySelector('section');
    const createElement = document.createElement('div');
    var size = Math.random() * 30;

    createElement.style.width = 20 + size + 'px';
    createElement.style.height = 20 + size + 'px';
    createElement.style.left = Math.random() * innerWidth + 'px';
    section.appendChild(createElement);

    setTimeout(() => {
        createElement.remove()
    }, 7000);
}

function drawBricks() {
    for(let column = 0; column < brickColumnCount; column++){
        for(let row = 0; row < brickRowCount; row++){
            if(bricks[column][row].status == 1){
                let brickX = (column*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (row*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[column][row].x = brickX;
                bricks[column][row].y = brickY;
                //ctx.fillStyle = 'red';
                 let index = Math.floor(Math.random() * (options.length));
                 let colorBrick = options[index];
                 ctx.fillStyle = colorBrick;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawButton(){
    buttonReset.innerHTML = "NEW GAME";
    buttonReset.onclick = function(){
        document.location.reload();
        }
    buttonReset.classList.add("buttonReset");
    document.body.appendChild(buttonReset);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //czyszczenie poprzedniego wykonania
    drawBall();
    drawBricks();
    drawPaddle();
    collisionDetection();

    if(y + newY < ballRadius) {
        newY = -newY;
    }
    else if(y + newY > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            newY = -newY;
        }
        else {
            lifes--;
            drawLifes();
            
            if(lifes == 0){
                ctx.fillStyle = "white";
                ctx.font = "40px Verdana";
                setInterval(ctx.fillText("Game over!", canvas.width /8, (canvas.height/2)-30));
                clearInterval(interval);
                drawButton();
            }
            else{
                x = canvas.width/2;
                y = canvas.height-30;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(x + newX < ballRadius /*odbicie od prawej krawędzi */ || x + newX > canvas.width/*odbicie od lewej krawędzi*/){
        newX = -newX;
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 4;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 4;
    }

    x += newX; //przesunięcie kółka
    y += newY;
    
}
setInterval(createBubbles, 100);
var interval = setInterval(draw, 10);