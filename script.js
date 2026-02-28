// ===== ELEMENTS =====
const car = document.getElementById("car");
const crossing = document.getElementById("crossing");
const scoreText = document.getElementById("points");
const mistakesText = document.getElementById("mistakes");
const speedText = document.getElementById("speedValue");

// ===== GAME STATE =====
let carLeft = 130;
let speed = 0;
let maxSpeed = 8;

let score = 0;
let mistakes = 0;

// Pedestrian crossing state
let crossingY = -120;
let crossingState = "APPROACH"; 
// APPROACH → ACTIVE → CLEARED
// ===== CONTROLS =====
document.addEventListener("keydown", (e) => {

  // LEFT / RIGHT
  if (e.key === "ArrowLeft" && carLeft > 0) {
    carLeft -= 10;
  }

  if (e.key === "ArrowRight" && carLeft < 260) {
    carLeft += 10;
  }

  // ACCELERATE
  if (e.key === "ArrowUp") {
    speed = Math.min(maxSpeed, speed + 1);
  }

  // BRAKE
  if (e.key === "ArrowDown") {
    speed = Math.max(0, speed - 1);
  }

  car.style.left = carLeft + "px";
  speedText.innerText = speed;
});

// STOP BUTTON
function stopCar() {
  speed = 0;
  speedText.innerText = speed;
}

// ===== PEDESTRIAN LOGIC =====


  let hasPenalized = false;
let waitFrames = 0;

function moveCrossing() {

  // Move crossing until fully cleared
  if (crossingState !== "CLEARED") {
    crossingY += speed;
    crossing.style.top = crossingY + "px";
  }

  // When crossing reaches car zone
  if (crossingY > 400 && crossingY < 460) {
    crossingState = "ACTIVE";
  }

  // ACTIVE: pedestrians crossing
  if (crossingState === "ACTIVE") {

    // If player tries to move → penalty ONCE
    if (speed > 0 && !hasPenalized) {
      mistakes++;
      mistakesText.innerText = mistakes;
      stopCar();
      hasPenalized = true;

      if (mistakes >= 3) {
        alert("Game Over");
        location.reload();
      }
    }

    // Wait ~1 second before clearing crossing
    waitFrames++;
    if (waitFrames > 60) {
      crossingState = "CLEARED";
    }
  }

  // After crossing cleared
  if (crossingState === "CLEARED") {
    crossingY += speed;

    if (crossingY > 600) {
      // Reset for next crossing
      crossingY = -120;
      crossingState = "APPROACH";
      hasPenalized = false;
      waitFrames = 0;

      score += 10;
      scoreText.innerText = score;
    }
  }
}
// ===== GAME LOOP =====
function gameLoop() {
  moveCrossing();
  requestAnimationFrame(gameLoop);
}
gameLoop();