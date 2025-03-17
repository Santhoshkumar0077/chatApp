import express from "express";
import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import router from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-puce-zeta.vercel.app/",
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

app.use(
  cors({
    origin: "https://chat-app-puce-zeta.vercel.app/",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/", router);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));
server.listen(process.env.PORT, () => {
  console.log(`server runs on ${process.env.PORT}`);
});
