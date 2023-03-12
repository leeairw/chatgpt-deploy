import { createContext } from 'react';

// trying to debug by adding a comment
export type ChatContextType = {
  chatHistory: { role: string; content: string }[];
  addChatHistory: (role: string, content: string) => void;
};

export const ChatContext = createContext<ChatContextType>({
  chatHistory: [],
  addChatHistory: () => {},
});