
const express = require("express");
const app = express();

const http = require("http").createServer(app);

const { Server } = require("socket.io");
const io = new Server(http);

app.use(express.static("public"));

// User Connection
io.on("connection", (socket) => {

    console.log("A user connected");

    // Receive and Broadcast Message
    socket.on("chat message", (message) => {

        io.emit("chat message", message);

    });

    // User Disconnect
    socket.on("disconnect", () => {

        console.log("A user disconnected");

    });

});

// Start Server
http.listen(3000, "0.0.0.0", () => {

    console.log("Chat App running at http://localhost:3000");

});

