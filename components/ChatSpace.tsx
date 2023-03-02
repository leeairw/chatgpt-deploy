'use client';

import { ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import { collection, orderBy, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import PastMessage from './PastMessage';

type Props = {
    chatId: string;
}

function ChatSpace({chatId}: Props) {

  const { data: session } = useSession();

  // fetch all messages under one chatId
  const [messages] =  useCollection(
    session &&
    query(
      collection(db, "users", session?.user?.email!, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    )
  );
  
  // console.log('ChatSpace Messages: ', messages)
  // console.log('ChatSpace Message Mapped: ', messages?.docs.map(message => (message.id)))

  return (
    <div className='flex-1 border-gray-700 overflow-y-scroll overflow-x-hidden'>

        {/* Give a notification is there is no chat yet */}
        {messages?.empty && (
          <>
            <p className='mt-10 text-center text-white'>
              Ask me anything! :)
            </p>
            <ArrowDownCircleIcon className='h-10 w-10 mx-auto mt-5 text-white animate-bounce'/>
          </>
        )}

        {/* List all past messages under one chatId */}
        {messages?.docs.map(message => (
          <div>
            <PastMessage key={message.id} messageId={message.id} 
            chatId={chatId} message={message.data()} />
          </div>
        ))}
    </div>
  )
}

export default ChatSpace