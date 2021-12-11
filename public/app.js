const guide = $("#guide");
const origin = new Origin();
let oneKeyToggle = true;
let twoKeysToggle = true;
let isRunning = false;
let keys = {};
let finalKeys = [];
window.onkeydown = window.onkeyup = function (e) {
  e = e || event;
  e.preventDefault();
  e.stopPropagation();
  keys[e.keyCode] = e.type === "keydown";
  // debug(keys);
  detect(e);
};

function detect(e) {
  finalKeys = []; // reset

  if (e.type === "keyup") {
    isRunning = false;
    // reset
    oneKeyToggle = true;
    twoKeysToggle = true;
  }

  // loop to get current pressed keys
  for (let key in keys) {
    if (keys[key]) finalKeys.push(+key);
  }
  // debug([finalKeys]);

  if (!finalKeys.length && e.type === "keyup" && [37, 38, 39, 40].includes(e.keyCode)) return idle();
  if (e.type === "keydown" && e.keyCode === 32) return stop(); // todo fix space key (32) not working with forwardLeft & backRight

  if (finalKeys.length === 2 && finalKeys.includes(38) && finalKeys.includes(39)) forwardRight();
  else if (finalKeys.length === 2 && finalKeys.includes(38) && finalKeys.includes(37)) forwardLeft();
  else if (finalKeys.length === 2 && finalKeys.includes(40) && finalKeys.includes(39)) backwardRight();
  else if (finalKeys.length === 2 && finalKeys.includes(40) && finalKeys.includes(37)) backwardLeft();
  else if (finalKeys.length === 1 && finalKeys[0] === 38) forward();
  else if (finalKeys.length === 1 && finalKeys[0] === 40) backward();
  else if (finalKeys.length === 1 && finalKeys[0] === 39) right();
  else if (finalKeys.length === 1 && finalKeys[0] === 37) left();
}

function forwardRight() {
  if (twoKeysToggle) {
    twoKeysToggle = false;
    isRunning = true;
    guide.textContent = "forwardRight";
    debug("forwardRight");
    signal("forwardRight");
  }
}

function forwardLeft() {
  if (twoKeysToggle) {
    twoKeysToggle = false;
    isRunning = true;
    guide.textContent = "forwardLeft";
    debug("forwardLeft");
    signal("forwardLeft");
  }
}

function backwardRight() {
  if (twoKeysToggle) {
    twoKeysToggle = false;
    isRunning = true;
    guide.textContent = "backwardRight";
    debug("backwardRight");
    signal("backwardRight");
  }
}

function backwardLeft() {
  if (twoKeysToggle) {
    twoKeysToggle = false;
    isRunning = true;
    guide.textContent = "backwardLeft";
    debug("backwardLeft");
    signal("backwardLeft");
  }
}

function forward() {
  if (oneKeyToggle) {
    oneKeyToggle = false;
    isRunning = true;
    guide.textContent = "forward";
    debug("forward");
    signal("forward");
  }
}

function backward() {
  if (oneKeyToggle) {
    oneKeyToggle = false;
    isRunning = true;
    guide.textContent = "backward";
    debug("backward");
    signal("backward");
  }
}

function right() {
  if (oneKeyToggle) {
    oneKeyToggle = false;
    isRunning = true;
    guide.textContent = "right";
    debug("right");
    signal("right");
  }
}

function left() {
  if (oneKeyToggle) {
    oneKeyToggle = false;
    isRunning = true;
    guide.textContent = "left";
    debug("left");
    signal("left");
  }
}

function stop() {
  if (isRunning) {
    isRunning = false;
    guide.textContent = "stop";
    debug("stop");
    signal("stop");
  }
}

function idle() {
  isRunning = false;
  guide.textContent = "idle";
  debug("idle");
  signal("idle");
}

function signal(type) {
  origin.post("/signal", { body: { type }, headers: { "Content-Type": "application/json" } });
}
