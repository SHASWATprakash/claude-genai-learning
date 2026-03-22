import fetch from "node-fetch";
import { getUserMemory, addMessageToMemory } from "../utils/memoryStore.js";

export const getClaudeResponse = async (userId, userMessage) => {
  try {
    const previousMessages = getUserMemory(userId);

    const messages = [
      ...previousMessages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        messages,
      }),
    });

    const data = await response.json();

    const textBlock = data.content?.find(
      (item) => item.type === "text"
    );

    const reply = textBlock?.text || "No response";

    // ✅ Save conversation
    addMessageToMemory(userId, {
      role: "user",
      content: userMessage,
    });

    addMessageToMemory(userId, {
      role: "assistant",
      content: reply,
    });

    return reply;
  } catch (error) {
    console.error("Claude Error:", error);
    throw error;
  }
};