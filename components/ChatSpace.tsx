'use client'

import { collection } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

type Props = {
    chatId: string;
}

function ChatSpace({chatId}: Props) {

  const { data: session } = useSession();
  const [messages] = useCollection(
    collection(db, "users", session?.user?.email!, "chats", chatId, "messages")
  );

  return (
    <div className='flex-1 border-gray-700 '>
      
        <p className=' hidden truncate md:block md:inline-text md:text-white justify-center text-center'>
        {/* Pull the last bit of that chat, or just say 'New Chat' */}
        {messages?.docs[messages?.docs.length - 1]?.data().text || "New Student"}
        </p>
    </div>
  )
}

export default ChatSpace