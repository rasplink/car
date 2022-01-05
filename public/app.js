window.SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition ||
  window.oSpeechRecognition;
// mic
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
// recognition.interimResults = true;
// max number of alternative transcripts
recognition.maxAlternatives = 5;
// recognition.continuous = true;
// speaker
const synth = window.speechSynthesis;
const speech = new SpeechSynthesisUtterance();
const voices = synth.getVoices();
// set voice
// speech.voice = voices[10]; // Note: some voices don't support altering params
speech.voiceURI = "native";
speech.lang = "en-US";
speech.volume = 1;
speech.rate = 0.9;
speech.pitch = 0.7;

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
  else if (e.type === "keydown" && e.keyCode === 17) return getTheMedicineTask();
}
let isListening = false;
let autoRestart = true;
if ("SpeechRecognition" in window && "speechSynthesis" in window) {
  recognition.onstart = () => (isListening = true);
  recognition.onend = () => (isListening = false);
  recognition.onerror = e => {
    if (e.error == "not-allowed" || e.error == "service-not-allowed") {
      autoRestart = false;
      console.error(`Recognition is not allowed!\n Please refresh the page and enable the mic.`);
    }
  };
  recognition.onresult = e => {
    // get spoken text
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("");
    console.log({ transcript });

    //* if done recognition
    if (e.results[0].isFinal) {
      isListening = false;
      console.log("got " + transcript);
      if (transcript.includes("medicine")) {
        say("roger that");
        getTheMedicineTask();
      }
    }
  };

  setInterval(() => {
    if (autoRestart) {
      if (!isListening && !synth.speaking) {
        console.log("Recognition Started");
        recognition.abort();
        recognition.start();
      } else if (synth.speaking && isListening) {
        console.log("Recognition Aborted");
        recognition.abort();
      } else if ((isListening && !synth.speaking) || (synth.speaking && !isListening)) {
        console.log("Return Nothing");
        return;
      }
    }
  }, 1000);
} else {
  console.warn(`Your browser is not supported!\n It's prefered to use the lastest version of google chrome.`);
}

function say(text) {
  speech.text = text;
  synth.speak(speech);
}

const speed = 1;
const time = 1100;
const distance = speed * time;
async function getTheMedicineTask() {
  await forwardLeft("arm");
  await wait(1000, true);
  await forward("car");
  await wait(distance, true);
  await backwardLeft("arm");
  await wait(500, true);
  await right("arm");
  await wait(1000, true);
  await forwardRight("arm");
  await wait(1000, true);
  await left("arm");
  await wait(500, true);
  await backward("car");
  await wait(distance, true);
  say("here you are");
}

function wait(time, stop) {
  return new Promise(resolve => {
    setTimeout(() => {
      isRunning = false;
      oneKeyToggle = true;
      twoKeysToggle = true;
      if (stop) idle().then(resolve);
      else resolve();
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
