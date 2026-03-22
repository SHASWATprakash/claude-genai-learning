const memory = {};

export const getUserMemory = (userId) => {
  return memory[userId] || [];
};

export const addMessageToMemory = (userId, message) => {
  if (!memory[userId]) {
    memory[userId] = [];
  }

  memory[userId].push(message);

  // Limit memory (last 10 messages)
  if (memory[userId].length > 10) {
    memory[userId].shift();
  }
};