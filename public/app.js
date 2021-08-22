const guide = document.getElementById("guide");
let isSendingSignal = true;

window.addEventListener("keydown", e => {
  if (e.keyCode === 38) forward();
  else if (e.keyCode === 39) right();
  else if (e.keyCode === 37) left();
});

window.addEventListener("keyup", e => {
  isSendingSignal = true;
  if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39) {
    idle();
  }
});

function forward() {
  if (isSendingSignal) {
    isSendingSignal = false;
    guide.textContent = "forward";
    console.log("forward");
    signal("forward");
  }
}

function right() {
  if (isSendingSignal) {
    isSendingSignal = false;
    guide.textContent = "right";
    console.log("right");
    signal("right");
  }
}

function left() {
  if (isSendingSignal) {
    isSendingSignal = false;
    guide.textContent = "left";
    console.log("left");
    signal("left");
  }
}

function idle() {
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
