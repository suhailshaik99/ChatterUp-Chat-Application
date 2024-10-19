import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  email: String,
  roomId: Number,
  profilePicture: String,
  shortTime: String,
  time: String,
});

export const Message = mongoose.model("Message", messageSchema);
