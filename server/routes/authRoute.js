import express from "express";
import { signup, login } from "../controller/authController.js";
import { protectedRoute } from "../middelware/prodectedmiddelware.js";
import {
  allUser,
  createConversation,
  messageUpdation,
} from "../controller/conversationController.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/allUser", protectedRoute, allUser);
router.post("/conversation", protectedRoute, createConversation);
router.post("/message", messageUpdation);
export default router;
