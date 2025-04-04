const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const app = require("./app");
const { handleSocketEvents } = require("./src/events/socket");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["*"],
    allowedHeaders: ["Content-Type"],
  },
});
app.set("io", io);
app.use(cors());
app.use(express.json());

handleSocketEvents(io);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
