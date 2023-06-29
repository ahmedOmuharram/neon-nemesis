let keyState = {};

let playerX = 0;
let playerY = 0;
let playerSpeed = 300;

let gravity = 1000;
let verticalVelocity = 0;
let jumpForce = 500;
let isOnGround = false;

const targetFPS = 1001;
const targetInterval = 1000 / targetFPS;

let previousTimestamp = 0;





function createCustomBody(bottomValue, rightValue, widthValue, heightValue) {
  document.body.innerHTML += `<div class="object solid" style="position:absolute; box-shadow: 2px 3px; border: 1px solid white; background-color: #c3c3c3; ${bottomValue}px; ${rightValue}px; width: ${widthValue}; height: ${heightValue}"></div>`;
}

//Main Menu
function createMainMenu(){
  createCustomBody('bottom: 200', 'right: 50', '20px', '500px');
  createCustomBody('bottom: 100', 'right: 500', '20px', '500px');
  createCustomBody('bottom: 400', 'right: 800', '500px', '20px');
  createCustomBody('bottom: 600', 'right: 300', '400px', '20px');
}

//Level 1
function createLevel1(){
  createCustomBody('top:100', 'left: 600', '300px', '100px');

  createCustomBody('bottom : 1', 'left: 730', '30px', '90%');
}


function createRamp(bottomValue, rightValue, widthValue, heightValue) {
  document.body.innerHTML += `<div class="object solid" style="border-radius: 0% 100% 0% 0%; box-shadow: 2px 3px; position:absolute; border: 1px solid white; background-color: #c3c3c3; bottom: ${bottomValue}px; right: ${rightValue}px; width: ${widthValue}px; height: ${heightValue}px"></div>`;
}

createMainMenu();

createRamp('400', '200', '200', '100');

let startButton = document.getElementById("start")

let player = document.getElementById("player");
let solids = document.querySelectorAll('.solid');

function checkCollision(obj1, obj2) {
  let rect1 = obj1.getBoundingClientRect();
  let rect2 = obj2.getBoundingClientRect();

  if (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  ) { return true; }

  return false;
}

function gameLoop(timestamp) {
    const elapsed = timestamp - previousTimestamp;
    const deltaTime = elapsed / 1000;

    verticalVelocity += gravity * deltaTime;
    playerY += verticalVelocity * deltaTime;
    
    // if (keyState["KeyW"]) {
    //     playerY -= playerSpeed * deltaTime;
    // }
    if (keyState["KeyA"]) {
        playerX -= playerSpeed * deltaTime;
    }
    // if (keyState["KeyS"]) {
    //     playerY += playerSpeed * deltaTime;
    // }
    if (keyState["KeyD"]) {
        playerX += playerSpeed * deltaTime;
    }

    if(keyState["Enter"])
    if(checkCollision(player, startButton)){
      for(var i = 5; i < solids.length; i++){
        solids[i].remove();
      }
      startButton.remove();
      createLevel1();
      player = document.getElementById("player");
      solids = document.querySelectorAll('.solid');
    }
    let colliding = false;
    let collidingWithStart = false;
    for( var i = 0; i < solids.length; i++) {
      if (checkCollision(player, solids[i])) {
        colliding = true;
        resolveCollision(player.getBoundingClientRect(), solids[i].getBoundingClientRect());
        solids[i].style.backgroundColor = "#ff0081"
      } else {
        if (solids[i].id == "start") {
          solids[i].style.backgroundColor = "#010081"
        } else {
          solids[i].style.backgroundColor = "#c3c3c3"
        }
      }
    }

    if (!colliding) {
      gravity = 1000;
    }

    if (playerX < 0) {
        playerX = 0;
        isOnGround = true;
    }

    if (playerY < 0) {
        playerY = 0;
    }
    
    if (playerX + player.offsetWidth > window.innerWidth) {
        playerX = window.innerWidth - player.offsetWidth;
        isOnGround = true;
    }
    
    if (playerY + player.offsetHeight > window.innerHeight) {
        playerY = window.innerHeight - player.offsetHeight;
        verticalVelocity = 0;
        isOnGround = true;
    }
    if(window.innerHeight < 70){
      player.remove();
    }

    player.style.transform = `translate(${playerX}px, ${playerY}px)`;


    previousTimestamp = timestamp;
    setTimeout(() => {
        requestAnimationFrame(gameLoop);
    }, targetInterval);
}

function resolveCollision(playerRect, solidRect) {

  const dx = (playerRect.left + playerRect.right) / 2 - (solidRect.left + solidRect.right) / 2;
  const dy = (playerRect.top + playerRect.bottom) / 2 - (solidRect.top + solidRect.bottom) / 2;

  const combinedHalfWidths = (playerRect.width + solidRect.width) / 2;
  const combinedHalfHeights = (playerRect.height + solidRect.height) / 2;

  if (Math.abs(dx) < combinedHalfWidths && Math.abs(dy) < combinedHalfHeights) {
    const overlapX = combinedHalfWidths - Math.abs(dx);
    const overlapY = combinedHalfHeights - Math.abs(dy);

    if (overlapX >= overlapY) {
      if (dy > 0) {
        playerY += overlapY;
        verticalVelocity = 0;
      } else {
        if (verticalVelocity > 0) {
          verticalVelocity = 0;
        }
        isOnGround = true;
        playerY -= overlapY;
      }
      return true;
    } else {
      if (dx > 0) {
        playerX += overlapX;
        isOnGround = true;
      } else {
        playerX -= overlapX;
        isOnGround = true;
      }
      return true;
    }
  }
}

function jump() {
    if (isOnGround) { 
      verticalVelocity = -jumpForce;
      isOnGround = false;
    }
}

document.addEventListener("keydown", (event) => {
  keyState[event.code] = true;
  if (event.code === "Space") {
    jump();
  }
});

document.addEventListener("keyup", (event) => {
  keyState[event.code] = false;
});

requestAnimationFrame(gameLoop);
