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

const forwardBtn = $("#forward");
const leftBtn = $("#left");
const rightBtn = $("#right");
const backwardBtn = $("#backward");
const forwardLeftBtn = $("#forwardLeft");
const forwardRightBtn = $("#forwardRight");
const backwardLeftBtn = $("#backwardLeft");
const backwardRightBtn = $("#backwardRight");
const stopBtn = $("#stop");
const btns = [forwardBtn, leftBtn, rightBtn, backwardBtn, forwardLeftBtn, forwardRightBtn, backwardLeftBtn, backwardRightBtn];

forwardBtn.on("mousedown", e => forward());
leftBtn.on("mousedown", e => left());
rightBtn.on("mousedown", e => right());
backwardBtn.on("mousedown", e => backward());
forwardLeftBtn.on("mousedown", e => forwardLeft());
forwardRightBtn.on("mousedown", e => forwardRight());
backwardRightBtn.on("mousedown", e => backwardRight());
backwardLeftBtn.on("mousedown", e => backwardLeft());
stopBtn.on("mousedown", e => stop());
// touch
forwardBtn.on("touchstart", e => forward());
leftBtn.on("touchstart", e => left());
rightBtn.on("touchstart", e => right());
backwardBtn.on("touchstart", e => backward());
forwardLeftBtn.on("touchstart", e => forwardLeft());
forwardRightBtn.on("touchstart", e => forwardRight());
backwardRightBtn.on("touchstart", e => backwardRight());
backwardLeftBtn.on("touchstart", e => backwardLeft());
stopBtn.on("touchstart", e => stop());

btns.forEach(btn => {
  function up() {
    isRunning = false;
    // reset
    oneKeyToggle = true;
    twoKeysToggle = true;
    idle();
  }
  btn.on("mouseup", e => up());
  btn.on("touchend", e => up());
});

function detect(e) {
  // console.log(e.keyCode);
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
  // else if (e.type === "keydown" && e.keyCode === 17) auto();
  else if (e.type === "keydown" && e.keyCode === 17) switchMotors();
}

let switchMotorsToggle = true;
function switchMotors() {
  if (switchMotorsToggle) {
    switchMotorsToggle = false;
    guide.textContent = "switchMotors => arm";
    debug("switchMotors => arm");
    signal("switchOn");
  } else {
    switchMotorsToggle = true;
    guide.textContent = "switchMotors => car";
    debug("switchMotors => car");
    signal("switchOff");
  }
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
  if (type === "switchOn") {
    origin.get(host + "/car/switch/on");
  } else if (type === "switchOff") {
    origin.get(host + "/car/switch/off");
  } else if (type === "forward") {
    origin.get(host + "/car/forward");
  } else if (type === "backward") {
    origin.get(host + "/car/backward");
  } else if (type === "right") {
    origin.get(host + "/car/right");
  } else if (type === "left") {
    origin.get(host + "/car/left");
  } else if (type === "forwardRight") {
    origin.get(host + "/car/forwardRight");
  } else if (type === "forwardLeft") {
    origin.get(host + "/car/forwardLeft");
  } else if (type === "backwardRight") {
    origin.get(host + "/car/backwardRight");
  } else if (type === "backwardLeft") {
    origin.get(host + "/car/backwardLeft");
  } else if (["idle", "stop"].includes(type)) {
    origin.get(host + "/car/stop");
  }
}
