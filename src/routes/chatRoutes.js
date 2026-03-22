import express from "express";
import { chatWithClaude } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", chatWithClaude);

export default router;