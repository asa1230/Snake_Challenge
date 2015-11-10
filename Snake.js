var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var Snake_size = 3;
var food;
var hiScore = 0;
var score = 0;
var Up_key = 87; //down
var Right_key = 68; //up
var Down_key = 83; //left
var Left_key = 65; //right

var windowWidth = 380;
var windowHeight = 287;
var windowWidthFrame = 360;
var windowHeightFrame = 270;

var tilesize = 1;

var Up = 11;
var Right = 12;
var Down = 13;
var Left = 14;
var Direction = Left;

var snakeGrowth = false;
var numProjectiles = 4;

var Snake = [];
var Projectiles = [];

var keysPressed = {};

keysPressed[Up_key] = false;
keysPressed[Right_key] = false;
keysPressed[Down_key] = false;
keysPressed[Left_key] = false;

var StartPositionX = windowWidth / 2;
var StartPositionY = windowHeight / 2;
var playerX = Math.floor(StartPositionX - 22);
var playerY = Math.floor(StartPositionY - 10);

document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);

StartGame();
function StartGame() {
    score = 0;
    Direction = Left;
    Snake_size = 3;
    snakeGrowth = false;

    Snake = [];
    Projectiles = [];

    playerX = Math.floor(StartPositionX - 22);
    playerY = Math.floor(StartPositionY - 10);

    createSnake();
    createFood();
    for (var i = 0; i < numProjectiles; i++) {
        createProjectile();
    }
    loop = setInterval(Update,80);
}

function createFood() {
    var randX = 11*(Math.floor(Math.random()*100000) % (Math.floor((windowWidth-11)/11)))+3;
    var randY = 11*(Math.floor(Math.random()*100000) % (Math.floor((windowHeight - 11)/11)))+1;
    food = {x: randX, y: randY};
    context.fillStyle = '#0099CC';
    context.fillRect(food.x*tilesize, food.y*tilesize,
                     10*tilesize, 10*tilesize);
    context.strokeStyle = '#ffffff';
    context.strokeRect(food.x*tilesize, food.y*tilesize,
                       10*tilesize, 10*tilesize);
}

function createSnake() {
    Snake_size = 3;
    Snake.push({x: playerX, y: playerY}); //head is on the left side
    Snake.push({x: playerX+11, y: playerY});
    Snake.push({x: playerX+22, y: playerY});

    for (var i = 0; i < Snake_size; i++) {
        var obj = Snake[i];
        context.fillStyle = '#0099CC';
        context.fillRect(obj.x*tilesize, obj.y*tilesize,
                         10*tilesize, 10*tilesize);
        context.lineWidth = 1;
        context.strokeStyle = '#135d80';
        context.strokeRect(obj.x*tilesize, obj.y*tilesize,
                           10*tilesize, 10*tilesize);
    }
}

function createProjectile() {
    var randX = 11*(Math.floor(Math.random()*100000) % (Math.floor((windowWidth-11)/11)))+3;
    var randY = 11*(Math.floor(Math.random()*100000) % (Math.floor((windowHeight - 11)/11)))+1;
    var AI_move = randY % 4; //0 = move up, 1-down 2-right 3-left
    Projectiles.push({x: randX, y: randY, dir: AI_move});
    context.fillStyle = '#800000';
    context.fillRect(Projectiles[Projectiles.length-1].x*tilesize,
                     Projectiles[Projectiles.length-1].y*tilesize,
                     10*tilesize, 10*tilesize);
    context.strokeStyle = '#ffffff';
    context.strokeRect(Projectiles[Projectiles.length-1].x*tilesize,
                       Projectiles[Projectiles.length-1].y*tilesize,
                       10*tilesize, 10*tilesize);
}

function Update() {
    context.fillStyle = "#339966";
    context.fillRect(0, 0, windowWidth*2, windowHeight*2);
    context.strokeStyle = '#135d80';
    context.strokeRect(0, 0, windowWidth*2, windowHeight*2);

    context.font="30px Verdana";
    var gradient=context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "orange");
    gradient.addColorStop("0.5", "yellow");
    gradient.addColorStop("1.0", "Black");
    context.fillStyle=gradient;
    context.fillText("Score: " + score, 10, 40);
    if (hiScore < score) hiScore = score;
    context.font="16px Georgia";
    context.fillText("Hi-Score: " + hiScore,300,20);

    if (keysPressed[Right_key] && Direction != Left) Direction = Right;
    if (keysPressed[Left_key] && Direction != Right) Direction = Left;
    if (keysPressed[Up_key] && Direction != Down) Direction = Up;
    if (keysPressed[Down_key] && Direction != Up) Direction = Down;

    move(Direction);
    moveProjectiles();
    printSnake();
    printFood();
    printProjectiles();
    Collision();
}

function Collision() {
    var collision = false;
    var substinance = false;
    if (Snake[0].x == food.x && Snake[0].y == food.y) substinance = true;
    if (Snake[0].x <= 0 || Snake[0].x >= windowWidth) collision = true;
    if (Snake[0].y <= 0 || Snake[0].y >= windowHeight) collision = true;
    for (var i = 1; i < Snake.length; i++) {
        if (Snake[0].x == Snake[i].x && Snake[0].y == Snake[i].y)
            collision = true;
    }
    for (i = 0; i < Projectiles.length; i++) {
        for (var j = 0; j < Snake.length; j++) {
         if (Snake[j].x == Projectiles[i].x && Snake[j].y == Projectiles[i].y)
            collision = true;
        }
    }
    if (substinance) {
        substinance = false;
        score += 10;
        snakeGrowth = true;
        createFood();
    }
    if (collision) {
        if (score > hiScore) hiScore = score;
        clearInterval(loop);
        StartGame();
    }
}


function printSnake() {
    for (var i = 0; i < Snake.length; i++) {
        var obj= Snake[i];
        context.fillStyle = '#0099CC';
        context.fillRect(obj.x*tilesize, obj.y*tilesize, 10*tilesize, 10*tilesize);
        context.strokeStyle = '#ffffff';
        context.strokeRect(obj.x*tilesize, obj.y*tilesize, 10*tilesize, 10*tilesize);
    }
}

function printProjectiles() {
    for (var i = 0; i < Projectiles.length; i++) {
        var obj = Projectiles[i];
        context.fillStyle = '#800000';
        context.fillRect(obj.x*tilesize, obj.y*tilesize, 10*tilesize, 10*tilesize);
        context.strokeStyle = '#ffffff';
        context.strokeRect(obj.x*tilesize, obj.y*tilesize, 10*tilesize, 10*tilesize);
    }
}

function printFood() {
    context.fillStyle = '#0099CC';
    context.fillRect(food.x*tilesize, food.y*tilesize,
                     10*tilesize, 10*tilesize);
    context.strokeStyle = '#ffffff';
    context.strokeRect(food.x*tilesize, food.y*tilesize,
                       10*tilesize, 10*tilesize);
}

function moveProjectiles() {
    //0 = move up, 1-down 2-right 3-left
    for (var i = 0; i < Projectiles.length; i++) {
        if (Projectiles[i].dir == 0) Projectiles[i].y = Projectiles[i].y - 11;
        if (Projectiles[i].dir == 1) Projectiles[i].y = Projectiles[i].y + 11;
        if (Projectiles[i].dir == 2) Projectiles[i].x = Projectiles[i].x + 11;
        if (Projectiles[i].dir == 3) Projectiles[i].x = Projectiles[i].x - 11;
        if (Projectiles[i].x <= 0) Projectiles[i].dir = 2;
        if (Projectiles[i].x >= windowWidth) Projectiles[i].dir = 3;
        if (Projectiles[i].y <= 0) Projectiles[i].dir = 1;
        if (Projectiles[i].y >= windowHeight) Projectiles[i].dir = 0;
    }
}



function move(D) {
    var sx = Snake[0].x;
    var sy = Snake[0].y
    var obj = {x: sx, y: sy};
    if (D == Left) { obj.x = obj.x-11; }
    if (D == Right) { obj.x = obj.x+11; }
    if (D == Up) { obj.y = obj.y-11; }
    if (D == Down) { obj.y = obj.y+11; }

    var lastLocation = Snake.pop();
    Snake.unshift(obj);
    if (snakeGrowth) {
        Snake.push(lastLocation);
        snakeGrowth = false;
    }
}

function keyDown(e) {
    if (e.keyCode in keysPressed) keysPressed[e.keyCode] = true;
}
function keyUp(e) {
    if (e.keyCode in keysPressed) keysPressed[e.keyCode] = false;
}
