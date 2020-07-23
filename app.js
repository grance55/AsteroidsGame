var express = require("express");
var app = express();
var path = require("path");
const { emit } = require("process");
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});

app.use(express.static(path.join(__dirname, "src")));

let ships = [];

io.on("connection", (socket) => {
  console.log("new conntect");

  socket.on("new", (data) => {
    ships.push(data);
    console.log("new");
  });

  socket.on("rotation", (data) => {
    ships = ships.map((item) => {
      if (data.id === item.id) {
        return item;
      }

      return data;
    });

    socket.broadcast.emit("update", ships);
  });
});
