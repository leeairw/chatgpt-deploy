'use client'

import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { collection, DocumentData, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

type Props = {
    // messageId:string,
    // chatId:string,
    message:DocumentData,
};

function PastMessage({message}:Props) {

    const { data: session } = useSession();
    console.log('individual past message: ', message)
    const isSmartLingo = message.user.name === "SmartLingo";
    console.log("is this chat from SmartLingo? ", isSmartLingo)

    return (
      
          <div className={`text-grey py-5 space-x-5 ${isSmartLingo && "bg-gray-200/50 rounded-lg"}`}>   
            <div className='flex space-x-2 px-2 max-w-2xl mx-auto'>
                <img src={message.user.avatar} alt="" className='h-8 w-8 rounded-lg'/>
                <p className='text-gray-600 text-sm '>{message.text}</p>
            </div>
              
          </div>
      
    )
}

export default PastMessage