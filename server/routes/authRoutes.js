const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const Conversation = require("../models/Conversation")

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET


router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, name: user.username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/all", auth, async (req, res) => {
  const loggedInUserId = req.user.id;
  const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
    "username"
  );
  res.status(200).json(users);
});


router.post("/get-conversation", async (req, res) => {
  try {
    const { loggedUser, selectedUser } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [loggedUser, selectedUser] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [loggedUser, selectedUser],
        messages: [],
      });
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/send-message", async (req, res) => {
  try {
    const { loggedUser, selectedUser, content } = req.body;

    const conversation = await Conversation.findOne({
      participants: { $all: [loggedUser, selectedUser] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const newMessage = { senderName: loggedUser, content, createdAt: new Date() };
    conversation.messages.push(newMessage);
    await conversation.save();

    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
