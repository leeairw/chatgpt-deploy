'use client'

import React, { createContext, useState } from 'react';
import ChatInput from '../../../components/ChatInput'
import VocabGrammCheck from '../../../components/VocabGrammCheck'
import ChatSpace from '../../../components/ChatSpace';
import Summarize from '../../../components/Summarize';
import InspireMe from '../../../components/InspireMe';
import { ChatContext, ChatContextType } from '../../../components/ChatContext';


// interface ChatContextType {
//   chatHistory: { role: string; content: string }[];
//   addChatHistory: (role: string, content: string) => void;
// }

// export const ChatContext = createContext<ChatContextType>({
//   chatHistory: [],
//   addChatHistory: () => {},
// });

type Props = {
  params: {
    id: string;
  };
};

function ChatPage({params: {id}}: Props) {
  const [chatHistory, setchatHistory] = useState<{ role: string; content: string }[]>([]);
  const addChatHistory = (role: string, content: string) => {
    setchatHistory([...chatHistory, { role, content }]);
  };

  return (
    <ChatContext.Provider value={{ chatHistory, addChatHistory }}>
      <div className='flex flex-col p-5 space-y-2 h-screen'>
            <ChatSpace chatId={id} chatHistory={chatHistory} addChatHistory={addChatHistory}/>
            <ChatInput chatId={id} chatHistory={chatHistory} addChatHistory={addChatHistory}/>
            <div className='flex flex-row space-x-2'>
              <Summarize chatId={id} chatHistory={chatHistory} addChatHistory={addChatHistory}/>
              <VocabGrammCheck chatId={id} chatHistory={chatHistory} addChatHistory={addChatHistory}/>
              <InspireMe chatId={id} chatHistory={chatHistory} addChatHistory={addChatHistory}/>
            </div>
      </div>
    </ChatContext.Provider>
  )
}

export default ChatPage