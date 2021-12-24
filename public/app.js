const guide = $("#guide");
const origin = new Origin();
const host = "http://192.168.1.55";
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
  if (e.type === "keydown" && e.keyCode === 32) return stop();
  // todo fix space key (32) not working with forwardLeft & backRight
  if (finalKeys.length === 2 && finalKeys.includes(38) && finalKeys.includes(39)) forwardRight();
  else if (finalKeys.length === 2 && finalKeys.includes(38) && finalKeys.includes(37)) forwardLeft();
  else if (finalKeys.length === 2 && finalKeys.includes(40) && finalKeys.includes(39)) backwardRight();
  else if (finalKeys.length === 2 && finalKeys.includes(40) && finalKeys.includes(37)) backwardLeft();
  else if (finalKeys.length === 1 && finalKeys[0] === 38) forward();
  else if (finalKeys.length === 1 && finalKeys[0] === 40) backward();
  else if (finalKeys.length === 1 && finalKeys[0] === 39) right();
  else if (finalKeys.length === 1 && finalKeys[0] === 37) left();
  else if (e.type === "keydown" && e.keyCode === 17) auto();
}

function auto() {
  if (oneKeyToggle) {
    oneKeyToggle = false;
    isRunning = true;
    guide.textContent = "auto";
    debug("auto");
    signal("auto");
  }
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
  if (type === "forward") {
    origin
      .get(host + "/pin4/off")
      .then(() => origin.get(host + "/pin5/on"))
      .then(() => origin.get(host + "/pin6/off"))
      .then(() => origin.get(host + "/pin7/off"));
  } else if (type === "backward") {
    origin
      .get(host + "/pin4/on")
      .then(() => origin.get(host + "/pin5/off"))
      .then(() => origin.get(host + "/pin6/off"))
      .then(() => origin.get(host + "/pin7/off"));
  } else if (type === "right") {
    origin
      .get(host + "/pin4/off")
      .then(() => origin.get(host + "/pin5/off"))
      .then(() => origin.get(host + "/pin6/on"))
      .then(() => origin.get(host + "/pin7/off"));
  } else if (type === "left") {
    origin
      .get(host + "/pin4/off")
      .then(() => origin.get(host + "/pin5/off"))
      .then(() => origin.get(host + "/pin6/off"))
      .then(() => origin.get(host + "/pin7/on"));
  } else if (type === "forwardRight") {
    origin
      .get(host + "/pin4/off")
      .then(() => origin.get(host + "/pin5/on"))
      .then(() => origin.get(host + "/pin6/on"))
      .then(() => origin.get(host + "/pin7/off"));
  } else if (type === "forwardLeft") {
    origin
      .get(host + "/pin4/off")
      .then(() => origin.get(host + "/pin5/on"))
      .then(() => origin.get(host + "/pin6/off"))
      .then(() => origin.get(host + "/pin7/on"));
  } else if (type === "backwardRight") {
    origin
      .get(host + "/pin4/on")
      .then(() => origin.get(host + "/pin5/off"))
      .then(() => origin.get(host + "/pin6/on"))
      .then(() => origin.get(host + "/pin7/off"));
  } else if (type === "backwardLeft") {
    origin
      .get(host + "/pin4/on")
      .then(() => origin.get(host + "/pin5/off"))
      .then(() => origin.get(host + "/pin6/off"))
      .then(() => origin.get(host + "/pin7/on"));
  } else if (["idle", "stop"].includes(type)) {
    origin
      .get(host + "/pin4/off")
      .then(() => origin.get(host + "/pin6/off"))
      .then(() => origin.get(host + "/pin5/off"))
      .then(() => origin.get(host + "/pin7/off"));
  }
}
