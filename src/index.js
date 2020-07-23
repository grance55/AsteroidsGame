import kontra from "kontra";
import io from "socket.io-client";

import "./styles.css";

const socket = io("http://localhost:3001");
console.log(socket);

kontra.init();
kontra.initKeys();

let sprites = [];

socket.on("update", (data) => {
  sprites = data.map((item) => shipFactory(item));

  console.log("update", sprites);
});

const loop = kontra.GameLoop({
  update() {
    sprites.forEach((item) => {
      item?.update();
    });
  },

  render: function () {
    sprites.forEach((item) => {
      item?.render();
    });
  },
});

loop.start();

document.getElementById("test-move").addEventListener("click", createNew);

function createNew() {
  const ship = kontra.Sprite({
    x: 300,
    y: 100,
    width: 40,
    height: 10,
    anchor: { x: 0.5, y: 0.5 },
    color: "red",
    rotation: 0,
    id: Date.now(),

    update() {
      if (kontra.keyPressed("left")) {
        this.rotation += -0.04;
      } else if (kontra.keyPressed("right")) {
        this.rotation += 0.04;
      }

      const cos = Math.cos(this.rotation);
      const sin = Math.sin(this.rotation);

      if (kontra.keyPressed("up")) {
        this.ddx = cos * 0.05;
        this.ddy = sin * 0.05;
      } else {
        this.ddx = this.ddy = 0;
      }

      this.advance();
      const magnitude = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      if (magnitude > 5) {
        this.dx *= 0.95;
        this.dy *= 0.95;
      }

      socket.emit("rotation", this);
    },
  });

  sprites.push(ship);

  socket.emit("new", ship);
}

function shipFactory(shipOptions) {
  console.log(shipOptions);
  return kontra.Sprite({
    x: shipOptions.x,
    y: shipOptions.y,
    width: 40,
    height: 10,
    color: shipOptions.color,
    rotation: shipOptions.rotation,
    anchor: { x: 0.5, y: 0.5 },
    id: Date.now(),

    update() {
      if (kontra.keyPressed("left")) {
        this.rotation += -0.04;
      } else if (kontra.keyPressed("right")) {
        this.rotation += 0.04;
      }

      const cos = Math.cos(this.rotation);
      const sin = Math.sin(this.rotation);

      if (kontra.keyPressed("up")) {
        this.ddx = cos * 0.05;
        this.ddy = sin * 0.05;
      } else {
        this.ddx = this.ddy = 0;
      }

      this.advance();
      const magnitude = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      if (magnitude > 5) {
        this.dx *= 0.95;
        this.dy *= 0.95;
      }

      socket.emit("rotation", this);
    },
  });
}
