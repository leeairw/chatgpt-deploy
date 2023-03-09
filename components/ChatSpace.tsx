'use client';

import { ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import { collection, orderBy, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import PastMessage from './PastMessage';
import { AcademicCapIcon, DeviceTabletIcon, ShieldExclamationIcon} from '@heroicons/react/24/outline'


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

        {messages?.empty && (
          <div className='hidden md:block'>
          <div className='space-y-4 text-center justify-center lg:space-y-0 lg:flex lg:space-x-6 text-white'>

            {/* Academic Icon */}
            <div className='flex flex-col items-center justify-center'>
                <div className='flex flex-col items-center justify-center mb-2'>
                    <div className='flex flex-row space-x-2 items-center'>
                        <AcademicCapIcon className="h-8 w-8 text-purple-400"/><h2>Examples</h2>
                    </div>
                </div>
                <div className='space-y-2'>
                    <p className='infoText'>"What's the difference b/w 'Ser' and 'Está' in Spanish?"</p>
                    <p className='infoText'>"How to say I love you in French?"</p>
                    <p className='infoText'>"Make up a fun dialogue for kids to learn Japanese."</p>
                </div>   
            </div>
            

            {/* Capabilities Icon */}
            <div className='flex flex-col items-center justify-center'>
                <div className='flex flex-col items-center justify-center mb-2'>
                    <div className='flex flex-row space-x-2 items-center'>
                        <DeviceTabletIcon className="h-8 w-8 text-purple-400"/><h2>Examples</h2>
                    </div>
                </div>
                <div className='space-y-2'>
                    <p className='infoText'>"Summarize text or explain a concept."</p>
                    <p className='infoText'>"Answer questions."</p>
                    <p className='infoText'>"Create content in all languages."</p>
                </div>   
            </div>

            {/* Limitations Icon */}
            <div className='flex flex-col items-center justify-center'>
                <div className='flex flex-col items-center justify-center mb-2'>
                    <div className='flex flex-row space-x-2 items-center'>
                        <ShieldExclamationIcon className="h-8 w-8 text-purple-400"/><h2>Limitations</h2>
                    </div>
                </div>
                <div className='space-y-2'>
                    <p className='infoText'>"Cannot answer certain racial and political questions."</p>
                    <p className='infoText'>"Cannot generate images."</p>
                    <p className='infoText'>"Cannot answer anything happened after 2021."</p>
                </div>   
            </div>
          </div>  
        </div>
        )}

        {/* List all past messages under one chatId */}
        {messages?.docs.map(message => ( message.data().user.type != "SmartButtonRequest" && (
          <div className="mt-2" >
            <PastMessage key={message.id} messageId={message.id} 
            chatId={chatId} message={message.data()} />
          </div>

        )
          
        ))}
    </div>
  )
}

export default ChatSpace