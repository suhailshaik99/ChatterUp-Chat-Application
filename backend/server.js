import path from "path";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import moment from "moment-timezone";
import { connectDB } from "./db/db-config.js";
import { Message } from "./chat/chat-model.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("frontend", "public")));

app.get("/welcome", (req, res) => {
  res.sendFile(path.resolve("frontend", "onboard.html"));
});

let user_name, room_Id, user_email;
app.post("/chat", (req, res) => {
  res.sendFile(path.resolve("frontend", "index.html"));
  const { username, roomId, email } = req.body;
  user_name = username;
  room_Id = roomId;
  user_email = email;
});

app.all("*", (req, res) => {
  res
    .status(404)
    .send(
      `Please head towards the url: http://localhost:3000/welcome, enter the necessary details such as the roomId you want to join and get started to hangout with your friend..`
    );
});

let onlineUsers = {};

io.on("connection", async (socket) => {
  const image = `http://localhost:3000/images/${
    Math.floor(Math.random() * 16) + 1
  }.jpg`;
  onlineUsers[socket.id] = user_name;

  // Room joining event
  socket.join(room_Id);

  // Group notifications emitting event
  socket
    .to(room_Id)
    .emit("group-notifications", `${user_name} has joined the room`);

  socket.emit("chat-hist", await Message.find({ roomId: room_Id }));

  // Emitting welcome event
  socket.emit("welcome", `Welome ${user_name}`);

  // Emitting the online users event
  io.emit("online-users-list", onlineUsers);

  // Emitting user information
  socket.emit("user-info", {
    user_name,
    room_Id,
    user_email,
    image,
    socketId: socket.id,
  });

  socket.on("typing", (typingData) => {
    socket.to(typingData.roomId).emit("typingEvent", typingData);
  });

  socket.on("group-chat", async (data) => {
    const currentTime = moment().tz("Asia/Kolkata").format("h:mm A");
    const fullTimeStamp = moment()
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD h:mm A z");
    const result = await Message.create({
      username: data.username,
      message: data.message,
      roomId: data.roomId,
      profilePicture: data.image,
      email: data.email,
      shortTime: currentTime,
      time: fullTimeStamp,
    });
    if (!result) throw new Error(error);
    io.to(data.roomId).emit("group-comm", {
      username: data.username,
      message: data.message,
      date: currentTime,
      image: data.image,
      socket_Id: data.socketId,
    });
  });

  socket.on("disconnect", () => {
    const disconnectedUser = onlineUsers[socket.id];
    io.to(room_Id).emit(
      "group-notifications",
      `${disconnectedUser} has left the room`
    );
    delete onlineUsers[socket.id];
    io.emit("online-users-list", onlineUsers);
  });
});

server.listen(process.env.PORT, async () => {
  await connectDB();
  console.log("Application is listening on port: ", process.env.PORT);
});
