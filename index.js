const express = require("express");
const app = express();
const path = require("path");
const { Board, Motor } = require("johnny-five");
const keypress = require("keypress");
const colors = require("colors");

class Car {
  speed = 255;
  constructor() {
    this.init();
  }

  init() {
    const board = new Board();
    board.on("ready", () => {
      console.log(colors.blue.bold("Board is Ready"));
      this.motor1 = new Motor({ pin: 5 });
      this.motor2 = new Motor({ pin: 6 });
      board.repl.inject({ motor1: this.motor1, motor2: this.motor2 });
      this.motor1.on("start", () => console.log(colors.green.bold("motor1 started")));
      this.motor2.on("start", () => console.log(colors.green.bold("motor2 started")));
      this.motor1.on("stop", () => console.log(colors.red.bold("motor1 stoped")));
      this.motor2.on("stop", () => console.log(colors.red.bold("motor2 stoped")));

      this.server();
      // this.control2();
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
    if (type === "forward") {
      this.motor1.start(this.speed);
      this.motor2.start(this.speed);
    } else if (type === "left") {
      this.motor1.start(this.speed);
      this.motor2.stop();
    } else if (type === "right") {
      this.motor2.start(this.speed);
      this.motor1.stop();
    } else if (type === "idle") {
      this.motor1.stop();
      this.motor2.stop();
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
