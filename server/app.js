require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http")
const { Server } = require("socket.io")
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app)
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", (id) => {
        socket.join(id);
        console.log(`${socket.id} joined to ${id}`)
    });

    socket.on("sendMessage", ({ id, newMessage }) => {
        socket.to(id).emit("receiveMessage", newMessage); 
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});
// Routes
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err));

server.listen(PORT, () => {
    console.log(`Server runs on ${process.env.PORT}`)
})
