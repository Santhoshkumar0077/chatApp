import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Signup successfully done" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Credentials not provided" });
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });
    const verifiedUser = await bcrypt.compare(password, user.password);
    if (!verifiedUser)
      return res.status(400).json({ message: "invalid credentials" });

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      username: user.username,
      token,
      message: "login successfully done",
    });
  } catch (error) {
    res.status(500).json({ message: "Internel server error" });
  }
};
