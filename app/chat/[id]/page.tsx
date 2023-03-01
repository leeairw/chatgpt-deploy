import React from 'react'
import ChatInput from '../../../components/ChatInput'
import VocabGrammCheck from '../../../components/VocabGrammCheck'
import ChatSpace from '../../../components/ChatSpace';

type Props = {
  params:{
    id:string;
  }
    
};

function ChatPage({params: {id}}: Props) {
  
  console.log("Props on ChatPage with ID", id);
  return (
    <div className='flex flex-col p-5 space-y-2 h-screen '>
            <ChatSpace chatId={id}/>
            <ChatInput chatId={id}/>
            <VocabGrammCheck chatId={id}/>
        
        {/* <VocabGrammCheck key={id} id={id}/> */}
    </div>
    
  )
}

export default ChatPage