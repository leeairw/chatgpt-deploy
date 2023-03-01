'use client'

import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { collection, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

type Props = {
    // messageId:string,
    // chatId:string,
    message:string,
};

function PastMessage({message}:Props) {

    const { data: session } = useSession();
    console.log('individual past message: ', message)

    return (
      
          <div className='flex items-center space-x-2 pb-1'>   
              <ChatBubbleLeftIcon className='h-5 w-5 text-white'/>
              <p className='text-gray-600'>{message}</p>
          </div>
      
    )
}

export default PastMessage