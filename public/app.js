const guide = document.getElementById("guide");
let isSendingSignal = true;
let isRunning = false;

window.addEventListener("keydown", e => {
  if (e.keyCode === 38) forward();
  else if (e.keyCode === 40) back();
  else if (e.keyCode === 39) right();
  else if (e.keyCode === 37) left();
  else if (e.keyCode === 32) stop();
});

window.addEventListener("keyup", e => {
  isSendingSignal = true; // reset to enable other moves again on keydown
  if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
    idle();
  }
});

function forward() {
  if (isSendingSignal) {
    isRunning = true;
    isSendingSignal = false;
    guide.textContent = "forward";
    console.log("forward");
    signal("forward");
  }
}

function back() {
  if (isSendingSignal) {
    isRunning = true;
    isSendingSignal = false;
    guide.textContent = "back";
    console.log("back");
    signal("back");
  }
}

function stop() {
  if (isRunning) {
    isRunning = false;
    guide.textContent = "stop";
    console.log("stop");
    signal("stop");
  }
}

function right() {
  if (isSendingSignal) {
    isRunning = true;
    isSendingSignal = false;
    guide.textContent = "right";
    console.log("right");
    signal("right");
  }
}

function left() {
  if (isSendingSignal) {
    isRunning = true;
    isSendingSignal = false;
    guide.textContent = "left";
    console.log("left");
    signal("left");
  }
}

function idle() {
  isRunning = false;
  guide.textContent = "idle";
  console.log("idle");
  signal("idle");
}

function signal(type) {
  fetch("/signal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });
}
