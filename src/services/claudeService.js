import { Chat } from "../models/chatModel.js";

export const getClaudeResponse = async (userId, userMessage) => {
  try {
    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    // ✅ Convert old messages to Claude format
    const formattedMessages = chat.messages.map((msg) => ({
      role: msg.role,
      content: [
        {
          type: "text",
          text: msg.content,
        },
      ],
    }));

    // ✅ Add new user message
    formattedMessages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: userMessage,
        },
      ],
    });

    // 🤖 Call Claude
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
        messages: formattedMessages,
      }),
    });

    const data = await response.json();

    // 🔥 DEBUG FULL RESPONSE
    console.log("RAW FULL:", JSON.stringify(data, null, 2));

    // ✅ Extract text safely
    const textBlock = data?.content?.find(
      (item) => item.type === "text"
    );

    if (!textBlock) {
      console.error("❌ No text block found:", data);
    }

    const reply = textBlock?.text || "No response";

    // 💾 Save messages (simple format for DB)
    chat.messages.push({ role: "user", content: userMessage });
    chat.messages.push({ role: "assistant", content: reply });

    if (chat.messages.length > 20) {
      chat.messages = chat.messages.slice(-20);
    }

    await chat.save();

    return reply;
  } catch (error) {
    console.error("Claude Error:", error);
    throw error;
  }
};