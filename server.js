const express = require("express");
const app = express();

const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join room", (roomId) => {
        socket.join(roomId);
    });

    socket.on("private message", (data) => {
        io.to(data.roomId).emit("private message", {
            message: data.message,
            sender: data.sender
        });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

http.listen(process.env.PORT || 3000, "0.0.0.0", () => {
    console.log("SHANU Chat Server running");
});
