document.addEventListener("deviceready", onDeviceReady, false);
// onDeviceReady(); // uncomment to test on pc browser
function onDeviceReady() {
  const statusContainer = $("#status");
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
  const origin = new Origin();
  const domain = "http://192.168.1.55";
  let oneKeyToggle = true;
  let twoKeysToggle = true;
  let isRunning = false;
  let keys = {};
  let currentKeys = [];
  window.onkeydown = window.onkeyup = function (e) {
    e = e || event;
    e.preventDefault();
    e.stopPropagation();
    keys[e.keyCode] = e.type === "keydown";
    detect(e);
  };

  forwardBtn.on("mousedown", (e) => forward());
  leftBtn.on("mousedown", (e) => left());
  rightBtn.on("mousedown", (e) => right());
  backwardBtn.on("mousedown", (e) => backward());
  forwardLeftBtn.on("mousedown", (e) => forwardLeft());
  forwardRightBtn.on("mousedown", (e) => forwardRight());
  backwardRightBtn.on("mousedown", (e) => backwardRight());
  backwardLeftBtn.on("mousedown", (e) => backwardLeft());
  stopBtn.on("mousedown", (e) => stop());
  // touch
  forwardBtn.on("touchstart", (e) => forward());
  leftBtn.on("touchstart", (e) => left());
  rightBtn.on("touchstart", (e) => right());
  backwardBtn.on("touchstart", (e) => backward());
  forwardLeftBtn.on("touchstart", (e) => forwardLeft());
  forwardRightBtn.on("touchstart", (e) => forwardRight());
  backwardRightBtn.on("touchstart", (e) => backwardRight());
  backwardLeftBtn.on("touchstart", (e) => backwardLeft());
  stopBtn.on("touchstart", (e) => stop());

  btns.forEach((btn) => {
    function up() {
      isRunning = false;
      // reset
      oneKeyToggle = true;
      twoKeysToggle = true;
      idle();
    }
    btn.on("mouseup", (e) => up());
    btn.on("touchend", (e) => up());
  });

  function detect(e) {
    // console.log(e.keyCode);
    currentKeys = []; // reset

    if (e.type === "keyup") {
      isRunning = false;
      // reset
      oneKeyToggle = true;
      twoKeysToggle = true;
    }

    // loop to get current pressed keys
    for (let key in keys) {
      if (keys[key]) currentKeys.push(+key);
    }
    // debug([currentKeys]);
    if (!currentKeys.length && e.type === "keyup" && [37, 38, 39, 40, 87, 83, 68, 65].includes(e.keyCode)) return idle();
    if (e.type === "keydown" && e.keyCode === 32) return stop();
    // todo fix space key (32) not working with forwardLeft & backRight
    if (currentKeys.length === 2 && currentKeys.includes(38) && currentKeys.includes(39)) forwardRight();
    else if (currentKeys.length === 2 && currentKeys.includes(38) && currentKeys.includes(37)) forwardLeft();
    else if (currentKeys.length === 2 && currentKeys.includes(40) && currentKeys.includes(39)) backwardRight();
    else if (currentKeys.length === 2 && currentKeys.includes(40) && currentKeys.includes(37)) backwardLeft();
    else if (currentKeys.length === 1 && currentKeys[0] === 38) forward();
    else if (currentKeys.length === 1 && currentKeys[0] === 40) backward();
    else if (currentKeys.length === 1 && currentKeys[0] === 39) right();
    else if (currentKeys.length === 1 && currentKeys[0] === 37) left();
  }

  function forwardRight() {
    return new Promise((resolve, reject) => {
      if (twoKeysToggle) {
        twoKeysToggle = false;
        isRunning = true;
        statusContainer.textContent = "Forward Right";
        debug("forwardRight");
        signal("forwardRight").then(resolve).catch(reject);
      }
    });
  }

  function forwardLeft() {
    return new Promise((resolve, reject) => {
      if (twoKeysToggle) {
        twoKeysToggle = false;
        isRunning = true;
        statusContainer.textContent = "Forward Left";
        debug("forwardLeft");
        signal("forwardLeft").then(resolve).catch(reject);
      }
    });
  }

  function backwardRight() {
    return new Promise((resolve, reject) => {
      if (twoKeysToggle) {
        twoKeysToggle = false;
        isRunning = true;
        statusContainer.textContent = "Backward Right";
        debug("backwardRight");
        signal("backwardRight").then(resolve).catch(reject);
      }
    });
  }

  function backwardLeft() {
    return new Promise((resolve, reject) => {
      if (twoKeysToggle) {
        twoKeysToggle = false;
        isRunning = true;
        statusContainer.textContent = "Backward Left";
        debug("backwardLeft");
        signal("backwardLeft").then(resolve).catch(reject);
      }
    });
  }

  function forward() {
    return new Promise((resolve, reject) => {
      if (oneKeyToggle) {
        oneKeyToggle = false;
        isRunning = true;
        statusContainer.textContent = "Forward";
        debug("forward");
        signal("forward").then(resolve).catch(reject);
      }
    });
  }

  function backward() {
    return new Promise((resolve, reject) => {
      if (oneKeyToggle) {
        oneKeyToggle = false;
        isRunning = true;
        statusContainer.textContent = "Backward";
        debug("backward");
        signal("backward").then(resolve).catch(reject);
      }
    });
  }

  function right() {
    return new Promise((resolve, reject) => {
      if (oneKeyToggle) {
        oneKeyToggle = false;
        isRunning = true;
        statusContainer.textContent = "Right";
        debug("right");
        signal("right").then(resolve).catch(reject);
      }
    });
  }

  function left() {
    return new Promise((resolve, reject) => {
      if (oneKeyToggle) {
        oneKeyToggle = false;
        isRunning = true;
        statusContainer.textContent = "Left";
        debug("left");
        signal("left").then(resolve).catch(reject);
      }
    });
  }

  function stop() {
    return new Promise((resolve, reject) => {
      if (isRunning) {
        isRunning = false;
        statusContainer.textContent = "Stop";
        debug("stop");
        signal("stop").then(resolve).catch(reject);
      }
    });
  }

  function idle() {
    return new Promise((resolve, reject) => {
      isRunning = false;
      statusContainer.textContent = "Idle";
      debug("idle");
      signal("idle").then(resolve).catch(reject);
    });
  }

  function signal(type) {
    const endpoint = domain + "/car";
    return new Promise((resolve, reject) => {
      if (["idle", "stop"].includes(type)) {
        origin
          .get(endpoint + "/stop")
          .then(resolve)
          .catch(reject);
      } else {
        origin
          .get(endpoint + "/" + type)
          .then(resolve)
          .catch(reject);
      }
    });
  }
}
