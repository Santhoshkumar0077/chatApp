import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
  participants: {
    type: [String],
    required: true,
  },
  messages: [
    {
      content: String,
      senderName: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
