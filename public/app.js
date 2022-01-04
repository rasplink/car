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

forwardBtn.on("mousedown", e => forward("car"));
leftBtn.on("mousedown", e => left("car"));
rightBtn.on("mousedown", e => right("car"));
backwardBtn.on("mousedown", e => backward("car"));
forwardLeftBtn.on("mousedown", e => forwardLeft("car"));
forwardRightBtn.on("mousedown", e => forwardRight("car"));
backwardRightBtn.on("mousedown", e => backwardRight("car"));
backwardLeftBtn.on("mousedown", e => backwardLeft("car"));
stopBtn.on("mousedown", e => stop());
// touch
forwardBtn.on("touchstart", e => forward("car"));
leftBtn.on("touchstart", e => left("car"));
rightBtn.on("touchstart", e => right("car"));
backwardBtn.on("touchstart", e => backward("car"));
forwardLeftBtn.on("touchstart", e => forwardLeft("car"));
forwardRightBtn.on("touchstart", e => forwardRight("car"));
backwardRightBtn.on("touchstart", e => backwardRight("car"));
backwardLeftBtn.on("touchstart", e => backwardLeft("car"));
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
  if (!finalKeys.length && e.type === "keyup" && [37, 38, 39, 40, 87, 83, 68, 65].includes(e.keyCode)) return idle();
  if (e.type === "keydown" && e.keyCode === 32) return stop();
  // todo fix space key (32) not working with forwardLeft & backRight
  // car
  if (finalKeys.length === 2 && finalKeys.includes(38) && finalKeys.includes(39)) forwardRight("car");
  else if (finalKeys.length === 2 && finalKeys.includes(38) && finalKeys.includes(37)) forwardLeft("car");
  else if (finalKeys.length === 2 && finalKeys.includes(40) && finalKeys.includes(39)) backwardRight("car");
  else if (finalKeys.length === 2 && finalKeys.includes(40) && finalKeys.includes(37)) backwardLeft("car");
  else if (finalKeys.length === 1 && finalKeys[0] === 38) forward("car");
  else if (finalKeys.length === 1 && finalKeys[0] === 40) backward("car");
  else if (finalKeys.length === 1 && finalKeys[0] === 39) right("car");
  else if (finalKeys.length === 1 && finalKeys[0] === 37) left("car");
  // arm
  if (finalKeys.length === 2 && finalKeys.includes(87) && finalKeys.includes(68)) forwardRight("arm");
  else if (finalKeys.length === 2 && finalKeys.includes(87) && finalKeys.includes(65)) forwardLeft("arm");
  else if (finalKeys.length === 2 && finalKeys.includes(83) && finalKeys.includes(68)) backwardRight("arm");
  else if (finalKeys.length === 2 && finalKeys.includes(83) && finalKeys.includes(65)) backwardLeft("arm");
  else if (finalKeys.length === 1 && finalKeys[0] === 87) forward("arm");
  else if (finalKeys.length === 1 && finalKeys[0] === 83) backward("arm");
  else if (finalKeys.length === 1 && finalKeys[0] === 68) right("arm");
  else if (finalKeys.length === 1 && finalKeys[0] === 65) left("arm");
  else if (e.type === "keydown" && e.keyCode === 17) return task1();
}
//todo  update arduino with "forwardRight" to start with "right" then "forward" 
async function task1() {
  await forward("arm");
  await wait(500);
  await idle();
  await left("arm");
  await wait(500);
  await idle();
  await forward("car");
  await wait(1000);
  await idle();
  await backward("arm");
  await wait(1000);
  await idle();
  await right("arm");
  await forward("arm");
  await wait(1000);
  await idle();
  await left("arm");
  await wait(500);
  await idle();
  await backward("car");
  await wait(1000);
  await idle();
}

function wait(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      isRunning = false;
      oneKeyToggle = true;
      twoKeysToggle = true;
      resolve();
    }, time);
  });
}

function forwardRight(device) {
  return new Promise(resolve => {
    if (twoKeysToggle) {
      twoKeysToggle = false;
      isRunning = true;
      guide.textContent = "forwardRight " + device;
      debug(["forwardRight", device]);
      signal("forwardRight", device).then(resolve);
    }
  });
}

function forwardLeft(device) {
  return new Promise(resolve => {
    if (twoKeysToggle) {
      twoKeysToggle = false;
      isRunning = true;
      guide.textContent = "forwardLeft " + device;
      debug(["forwardLeft", device]);
      signal("forwardLeft", device).then(resolve);
    }
  });
}

function backwardRight(device) {
  return new Promise(resolve => {
    if (twoKeysToggle) {
      twoKeysToggle = false;
      isRunning = true;
      guide.textContent = "backwardRight " + device;
      debug(["backwardRight", device]);
      signal("backwardRight", device).then(resolve);
    }
  });
}

function backwardLeft(device) {
  return new Promise(resolve => {
    if (twoKeysToggle) {
      twoKeysToggle = false;
      isRunning = true;
      guide.textContent = "backwardLeft " + device;
      debug(["backwardLeft", device]);
      signal("backwardLeft", device).then(resolve);
    }
  });
}

function forward(device) {
  return new Promise(resolve => {
    if (oneKeyToggle) {
      oneKeyToggle = false;
      isRunning = true;
      guide.textContent = "forward " + device;
      debug(["forward", device]);
      signal("forward", device).then(resolve);
    }
  });
}

function backward(device) {
  return new Promise(resolve => {
    if (oneKeyToggle) {
      oneKeyToggle = false;
      isRunning = true;
      guide.textContent = "backward " + device;
      debug(["backward", device]);
      signal("backward", device).then(resolve);
    }
  });
}

function right(device) {
  return new Promise(resolve => {
    if (oneKeyToggle) {
      oneKeyToggle = false;
      isRunning = true;
      guide.textContent = "right " + device;
      debug(["right", device]);
      signal("right", device).then(resolve);
    }
  });
}

function left(device) {
  return new Promise(resolve => {
    if (oneKeyToggle) {
      oneKeyToggle = false;
      isRunning = true;
      guide.textContent = "left " + device;
      debug(["left", device]);
      signal("left", device).then(resolve);
    }
  });
}

function stop() {
  return new Promise(resolve => {
    if (isRunning) {
      isRunning = false;
      guide.textContent = "stop";
      debug("stop");
      signal("stop").then(resolve);
    }
  });
}

function idle() {
  return new Promise(resolve => {
    isRunning = false;
    guide.textContent = "idle";
    debug("idle");
    signal("idle").then(resolve);
  });
}

function signal(type, device) {
  const endpoint = host + "/" + device;
  return new Promise((resolve, reject) => {
    if (type === "forward") {
      origin
        .get(endpoint + "/forward")
        .then(resolve)
        .catch(reject);
    } else if (type === "backward") {
      origin
        .get(endpoint + "/backward")
        .then(resolve)
        .catch(reject);
    } else if (type === "right") {
      origin
        .get(endpoint + "/right")
        .then(resolve)
        .catch(reject);
    } else if (type === "left") {
      origin
        .get(endpoint + "/left")
        .then(resolve)
        .catch(reject);
    } else if (type === "forwardRight") {
      origin
        .get(endpoint + "/forwardRight")
        .then(resolve)
        .catch(reject);
    } else if (type === "forwardLeft") {
      origin
        .get(endpoint + "/forwardLeft")
        .then(resolve)
        .catch(reject);
    } else if (type === "backwardRight") {
      origin
        .get(endpoint + "/backwardRight")
        .then(resolve)
        .catch(reject);
    } else if (type === "backwardLeft") {
      origin
        .get(endpoint + "/backwardLeft")
        .then(resolve)
        .catch(reject);
    } else if (["idle", "stop"].includes(type)) {
      origin
        .get(host + "/stop")
        .then(resolve)
        .catch(reject);
    }
  });
}
