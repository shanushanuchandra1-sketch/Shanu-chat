const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const databaseFile = path.join(__dirname, "messages.json");

let messageHistory = {};

if (fs.existsSync(databaseFile)) {
    messageHistory = JSON.parse(fs.readFileSync(databaseFile, "utf8"));
}
const app = express();

const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);
app.use(express.static("public"));
// Photo Upload System

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const filename = Date.now() + "-" + Math.round(Math.random() * 1000000) + extension;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});

app.post("/upload", upload.single("photo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No photo selected" });
    }

    res.json({
        success: true,
        imageUrl: "/uploads/" + req.file.filename
    });
});

const onlineUsers = {};
io.on("connection", (socket) => {
    console.log("A user connected");
socket.on("user online", (phone) => {
    onlineUsers[phone] = socket.id;

    io.emit("online users", Object.keys(onlineUsers));
});

    socket.on("join room", (roomId) => {
    socket.join(roomId);

    if (!messageHistory[roomId]) {
        messageHistory[roomId] = [];
    }

    socket.emit("message history", messageHistory[roomId]);
});

socket.on("private message", (data) => {
    if (!messageHistory[data.roomId]) {
        messageHistory[data.roomId] = [];
    }

const newMessage = {
    message: data.message,
    type: data.type || "text",
    sender: data.sender,
    time: new Date().toISOString()
};
    messageHistory[data.roomId].push(newMessage);
fs.writeFileSync(databaseFile, JSON.stringify(messageHistory, null, 2));
    io.to(data.roomId).emit("private message", newMessage);
});
socket.on("disconnect", () => {
    console.log("A user disconnected");

    for (const phone in onlineUsers) {
        if (onlineUsers[phone] === socket.id) {
            delete onlineUsers[phone];
        }
    }

    io.emit("online users", Object.keys(onlineUsers));
});
});

http.listen(process.env.PORT || 3000, "0.0.0.0", () => {
    console.log("SHANU Chat Server running");
});
