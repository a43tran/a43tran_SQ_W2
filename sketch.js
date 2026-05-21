// ============================================================
// Side Quest Week 2
// ============================================================

let sushiBackground;
let sushiBody;
let wasabi;

let platforms = [
  { x: 0,   y: 410, w: 800, h: 40 }, // ground (full width floor)
  { x: 80, y: 230, w: 120, h: 16 }, // left high platform
  { x: 210, y: 350, w: 110, h: 16 }, // left low platform
  { x: 560, y: 300, w: 120, h: 16 }, // centre low platform
  { x: 290, y: 120, w: 140, h: 16 }, // centre platform
  { x: 500, y: 180, w: 110, h: 16 }, // right high platform
  { x: 620, y: 90, w: 120, h: 16 }, // far right platform
  { x: 320, y: 250, w: 100, h: 16, slippery: true}, // slippery platform
];

let player = {
  x: 100,
  y: 100,

  vx: 0,
  vy: 0, 

  w: 90,
  h: 90,
  r: 25,

  speed: 0.55,  
  maxSpeed: 4.5, 
  jumpForce: -12, 
  friction: 0.78, 

  onGround: false,
};

const GRAVITY = 0.6; 

let sushiT = 0;

const PLATFORM_COLOR = [59, 19, 4]; 

function preload() {
  sushiBackground = loadImage("assets/images/sushi-restaurant.png");
  sushiBody = loadImage("assets/images/sushi.png");
  wasabi = loadImage("assets/images/wasabi.png");
}

function setup() {
  createCanvas(800, 450);

  player.y = platforms[0].y - player.r;
}

function draw() {
  background(sushiBackground);
  filter(BLUR, 5);

  handleInput();
  applyPhysics();
  resolvePlatformCollisions();

  drawWasabi();
  drawPlatforms();
  drawPlayer();
  drawHUD();

  sushiT += 0.015; 
}

function handleInput() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // LEFT or A
    player.vx -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // RIGHT or D
    player.vx += player.speed;
  }

  player.vx = constrain(player.vx, -player.maxSpeed, player.maxSpeed);

  if (
    !keyIsDown(LEFT_ARROW) &&
    !keyIsDown(65) &&
    !keyIsDown(RIGHT_ARROW) &&
    !keyIsDown(68)
  ) {
    player.vx *= player.friction;
  }

  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && player.onGround) { // UP or W
    player.vy = player.jumpForce;
    player.onGround = false;
  }
}

function applyPhysics() {
  player.vy += GRAVITY;
  player.x += player.vx;
  player.y += player.vy;
  player.x = constrain(player.x, player.r, width - player.r);

  if (player.y > height + 100) {
    player.x = 100;
    player.y = platforms[0].y - player.r;
    player.vx = 0;
    player.vy = 0;
  }

  player.onGround = false;
}

function resolvePlatformCollisions() {
  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];

    let playerLeft   = player.x - player.r;
    let playerRight  = player.x + player.r;
    let playerBottom = player.y + player.r;

    let platLeft  = p.x;
    let platRight = p.x + p.w;
    let platTop   = p.y;

    let overlapsHorizontally = playerRight > platLeft && playerLeft < platRight;

    let landingOnTop =
      player.vy >= 0 &&
      playerBottom >= platTop &&
      playerBottom <= platTop + 20;

    if (overlapsHorizontally && landingOnTop) {
      player.y = platTop - player.r; 
      
      if (p.slippery) {
        player.vy = 3;
        player.vx *= 1.5;
        player.onGround = false;
    } else {
      player.vy = 0;
      player.onGround = true; 
    }
  }
}
}

function drawPlatforms() {
  noStroke();

  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];

    if (p.slippery) {
      fill(133,179,0);
    } else {
        fill(PLATFORM_COLOR[0], PLATFORM_COLOR[1], PLATFORM_COLOR[2]);
    }

    rect(p.x, p.y, p.w, p.h, 6); 
  }
 }

function drawPlayer() {
  push(); 
  imageMode(CENTER);
  image(sushiBody, player.x, player.y, player.w, player.h);
  pop(); 
}

function drawWasabi() {
  push();
  image(wasabi, 320, 220, 100, 40);
  pop();
}

function drawHUD() {
  fill(255);
  noStroke();
  textSize(13);
  textAlign(LEFT);
  text("Move: Arrow Keys or WASD   Jump: W or Up Arrow", 16, 24);
}
