'use client'

import { ArrowDownCircleIcon, ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { collection, deleteDoc, doc, DocumentData, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

type Props = {
    messageId:string,
    chatId:string,
    message:DocumentData,
};

function PastMessage({messageId, chatId, message}:Props) {

    const { data: session } = useSession();
    // console.log('individual past message: ', message)
    const isUserRequest = (message.user.type === "UserRequest");
    const isUserRequestResponse = (message.user.type === "UserRequestResponse");
    const isSmartButtonRequest = (message.user.type === "SmartButtonRequest");
    const isSmartButtonResponse = (message.user.type === "SmartButtonRequestResponse")
    const isInspireMeRequest = (message.user.type === "InspireMeRequest");
    // console.log("is this chat from SmartLingo? ", isSmartLingo)

    // delete chat
    const removeChat = async() => {
        await deleteDoc(
            doc(db, "users", session?.user?.email!, "chats", chatId, "messages", messageId)
        )
    }

    console.log("You better not be SmartButtonRequest: ", message.user.type)

    return (
      
          <div className={`text-grey py-5 space-x-5
          ${isUserRequestResponse && "bg-gray-600/20 rounded-lg"} 
          ${isSmartButtonResponse && "bg-blue-400/20 rounded-lg mt-5"}`}
          >   
                {/* If it were a SmartButton Request&Response, we wanna highlight it differently */}
                {isSmartButtonResponse && (
                    <div className='flex justify-center items-center px-2 mx-auto'>
                        <div className='flex-grow'>
                            {(message.user.name === "Summary") && <p className='text-center text-white'>Summary</p> }
                            {(message.user.name === "VocabGrammCheck") && <p className='text-center text-white'>Check Vocab and Grammar Mistakes</p> }
                            <ArrowDownCircleIcon className='h-10 w-10 mx-auto mt-2 mb-2 text-white animate-bounce flex-grow'/>
                            <div className='flex space-x-2 px-2 max-w-2xl mx-auto'>
                                <img src={message.user.avatar} alt="" className='h-8 w-8 rounded-lg'/>
                                <p className='text-gray-600 text-sm flex-grow'>{message.text}</p>
                                <TrashIcon onClick={removeChat} className='shrink-0 h-5 w-5 text-gray-700 hover:text-red-700'/>
                            </div>
                        </div>
                    </div>
                )}

                {/* If it is an Inspire Me request */}
                {isInspireMeRequest && (
                    <div>
                        <div className='flex-grow'>
                            <p className='text-center text-white'>{message.user.name}</p> 
                            <ArrowDownCircleIcon className='h-10 w-10 mx-auto mt-2 mb-2 text-white animate-bounce flex-grow'/>
                            {/* <TrashIcon onClick={removeChat} className='shrink-0 h-5 w-5 text-gray-700 hover:text-red-700'/> */}
                            <div className='flex space-x-2 px-2 max-w-2xl mx-auto'>
                                {/* <img src={message.user.avatar} alt="" className='h-8 w-8 rounded-lg'/> */}
                                <p className='text-gray-600 text-sm flex-grow'></p> 
                                <TrashIcon onClick={removeChat} className='shrink-0 h-5 w-5 text-gray-700 hover:text-red-700'/>
                            </div>
                        </div>
                    </div>
                )}

                {/* If not, let's just display the conversations */}
                {!isSmartButtonResponse && !isInspireMeRequest && (
                    
                    <div className='flex space-x-2 px-2 max-w-2xl mx-auto'>
                        <img src={message.user.avatar} alt="" className='h-8 w-8 rounded-lg'/>
                        <p className='text-gray-600 text-sm flex-grow'>{message.text}</p>
                        <TrashIcon onClick={removeChat} className='shrink-0 h-5 w-5 text-gray-700 hover:text-red-700'/>
                    </div>
                )}

              
          </div>
      
    )
}

export default PastMessage