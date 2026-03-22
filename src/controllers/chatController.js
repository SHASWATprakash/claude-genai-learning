import { getClaudeResponse } from "../services/claudeService.js";

export const chatWithClaude = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({
        error: "Message and userId are required",
      });
    }

    const reply = await getClaudeResponse(userId, message);

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({
      error: "Failed to get response from Claude",
    });
  }
};