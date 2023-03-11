import { createContext } from 'react';

export type ChatContextType = {
  chatHistory: { role: string; content: string }[];
  addChatHistory: (role: string, content: string) => void;
};

export const ChatContext = createContext<ChatContextType>({
  chatHistory: [],
  addChatHistory: () => {},
});