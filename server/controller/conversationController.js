import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

export const allUser = async (req, res) => {
  try {
    const username = req.user.username;
    const users = await User.find({ username: { $ne: username } }).select(
      "username"
    );

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { loggedUserName, selectedUserName } = req.body;
    const existingConversation = await Conversation.findOne({
      participants: { $all: [loggedUserName, selectedUserName] },
    });
    if (existingConversation) {
      res.status(200).json({ existingConversation });
      return;
    }
    const newConversation = new Conversation({
      participants: [loggedUserName, selectedUserName],
    });
    await newConversation.save();
    res.status(200).json({ newConversation });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const messageUpdation = async (req, res) => {
  try {
    const { id, loggedUserName, content } = req.body;
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    conversation.messages.push({
      senderName: loggedUserName,
      content: content,
    });
    await conversation.save();
    res.status(200).json({message:"Message updated"})
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
