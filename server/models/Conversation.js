const mongoose = require("mongoose")
const messageSchema = new mongoose.Schema({
  senderName: { type: String, required: true }, 
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  participants: { type: [String], required: true },
  messages: [messageSchema],
});

module.exports =  mongoose.model("Conversation", conversationSchema);


