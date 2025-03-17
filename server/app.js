import express from "express";
import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import router from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-one-blue.vercel.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  socket.on("joinRoom", (id) => {
    socket.join(id);
    console.log(`User ${socket.id} joined room ${id}`);
  });
  socket.on("sendMessage", ({ id, message }) => {
    io.to(id).emit("receiveMessage", { message });
  });
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/", router);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));
server.listen(process.env.PORT, () => {
  console.log(`server runs on ${process.env.PORT}`);
});
