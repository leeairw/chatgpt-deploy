'use client'

import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react'

type Props = {
    id:string;
};

function ChatRow({id}: Props) {
  
  
  return (
    <Link href={`chat/${id}`}>
        <div className='flex space-x-1 border-gray-700 border chatRow justify-center'>   
            <ChatBubbleLeftIcon className='h-5 w-5 text-white'/>
            <p className=' hidden truncate md:block md:inline-text md:text-white justify-center text-center'>New Chat</p>
            <TrashIcon className='h-5 w-5 text-gray-700 hover:text-red-700'/>
        </div>
    </Link>
    
  )
}

export default ChatRow