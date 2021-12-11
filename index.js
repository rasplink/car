const express = require("express");
const app = express();
const path = require("path");
const { Board, Motor, Led, Relays } = require("johnny-five"); // works on node 10.0.0
const keypress = require("keypress");
const colors = require("colors");

class Car {
  constructor() {
    this.speed = 255;
    this.init();
  }

  init() {
    const board = new Board();
    board.on("ready", () => {
      console.log(colors.blue.bold("Board is Ready"));
      // new Led(13).blink(1000); // uncomment to test board

      // start handle motors forward/backward
      const relays = new Relays([7, 8, 9, 10]);
      this.relay1 = relays[0]; // relay on pin 7
      this.relay2 = relays[1]; // relay on pin 8
      this.relay3 = relays[2]; // relay on pin 9
      this.relay4 = relays[3]; // relay on pin 10
      // reset
      this.relay1.close();
      this.relay2.close();
      this.relay3.close();
      this.relay4.close();
      // end handle motors forward/backward

      this.motor1 = new Motor({ pin: 5 });
      this.motor2 = new Motor({ pin: 6 });
      board.repl.inject({ motor1: this.motor1, motor2: this.motor2 });
      this.motor1.on("start", () => console.log(colors.green.bold("motor1 started")));
      this.motor2.on("start", () => console.log(colors.green.bold("motor2 started")));
      this.motor1.on("stop", () => console.log(colors.red.bold("motor1 stoped")));
      this.motor2.on("stop", () => console.log(colors.red.bold("motor2 stoped")));

      this.server();
    });
  }

  server() {
    // middleware
    app.use(express.static(path.join(__dirname, "./public")));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    // catch all routes
    app.get("/*", async (req, res) => res.sendFile(path.resolve(__dirname, "./public/index.html")));

    app.post("/signal", (req, res) => {
      const type = req.body.type;
      if (type) {
        this.control(type);
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    });

    // listen
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(colors.green.bold("http://localhost:" + port)));
  }

  control(type) {
    // forward/backward = motor1
    // right/left = motor2
    const resetRelays = () => {
      this.relay1.close();
      this.relay2.close();
      this.relay3.close();
      this.relay4.close();
    };
    resetRelays();

    const forward = () => {
      if (!this.motor1.isOn) this.motor1.start(this.speed);
    };

    const backward = () => {
      this.relay1.open();
      this.relay2.open();
      if (!this.motor1.isOn) this.motor1.start(this.speed);
    };

    const right = () => {
      if (!this.motor2.isOn) this.motor2.start(this.speed);
    };

    const left = () => {
      this.relay3.open();
      this.relay4.open();
      if (!this.motor2.isOn) this.motor2.start(this.speed);
    };

    const stopMotor1 = () => {
      if (this.motor1.isOn) this.motor1.stop();
    };

    const stopMotor2 = () => {
      if (this.motor2.isOn) this.motor2.stop();
    };

    if (type === "forward") {
      stopMotor2();
      forward();
    } else if (type === "backward") {
      stopMotor2();
      backward();
    } else if (type === "right") {
      stopMotor1();
      right();
    } else if (type === "left") {
      stopMotor1();
      left();
    } else if (type === "forwardRight") {
      forward();
      right();
    } else if (type === "forwardLeft") {
      forward();
      left();
    } else if (type === "backwardRight") { // todo fix backward right when all relayes on
      backward();
      right();
    } else if (type === "backwardLeft") {
      backward();
      left();
    } else if (["idle", "stop"].includes(type)) {
      stopMotor1();
      stopMotor2();
      resetRelays();
    }
  }

  control2() {
    keypress(process.stdin);
    process.stdin.on("keypress", (ch, key) => {
      console.log(colors.yellow('got "keypress"', key));
      if (key && key.ctrl && key.name == "c") process.exit();

      // directions of the car via keyboard arrows
      if (key.name === "up") {
        this.motor1.start(255);
        this.motor2.start(255);
      } else if (key.name === "down") {
        this.motor1.stop();
        this.motor2.stop();
      } else if (key.name === "left") {
        this.motor1.start(255);
        this.motor2.stop();
      } else if (key.name === "right") {
        this.motor2.start(255);
        this.motor1.stop();
      }
    });
    process.stdin.setRawMode(true);
    process.stdin.resume();
  }
}

new Car();
