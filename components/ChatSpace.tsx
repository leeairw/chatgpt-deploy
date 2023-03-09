'use client';

import { ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import { collection, orderBy, query,serverTimestamp, addDoc  } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import PastMessage from './PastMessage';
import { AcademicCapIcon, DeviceTabletIcon, ShieldExclamationIcon} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast';
import useSWR from "swr";


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

  // sample questions
  const sample_questions = [
    "What's the difference b/w 'Ser' and 'Está' in Spanish?",
    "How to say I love you in French?",
    "Make up a fun dialogue for kids to learn Japanese.",
    "Summarize text or explain a concept.",
    "Create content in all languages."
  ]

  // set the model for sample question
  const { data: model, mutate: setModel } = useSWR('model', {
    fallbackData: 'text-davinci-003'
  });

  const sendSampleQuestion = async(sample_question: string) => {
    // Define the sample question input format
    const sample_question_fb: Message = {
      text: sample_question,
      createdAt: serverTimestamp(),
      user: {
          _id: session?.user?.email!,
          name: session?.user?.name!,
          type: "UserRequest",
          avatar: session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      }
    }

    await addDoc(
        collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'),
        sample_question_fb 
    )

    console.log("Current sample question: ", sample_question)

    // Toast notification to say Loading
    const notification = toast.loading('Smart Lingo is thinking...')
    await fetch('/api/askQuestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            prompt: sample_question_fb, chatId, model, session
        }),
    }).then(() => {
        // Toast notificaion to say successful!
        toast.success("Smart Lingo has responded!", {
            id: notification,
        })
    })
  };

  
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
                <div className='space-y-2 '>
                   {sample_questions.map((sample_q) => {
                    console.log("Current sample_q: ", sample_q)
                    const handleClick = async () => {
                      await sendSampleQuestion(sample_q);
                    };
                    
                    return (
                      <div onClick={handleClick} className={`sampleQuestionButton`}>
                        <p className=''>{sample_q}</p>
                      </div>
                    )            
                  }
                    
                   )}
                </div>   
            </div>
            

            {/* Limitations Icon */}
            {/* <div className='flex flex-col items-center justify-center'>
                <div className='flex flex-col items-center justify-center mb-2'>
                    <div className='flex flex-row space-x-2 items-center'>
                        <ShieldExclamationIcon className="h-8 w-8 text-purple-400"/><h2>Limitations</h2>
                    </div>
                </div>
                <div className='space-y-2'>
                    <p className='infoText'>"Cannot answer certain racial and political questions."</p>
                    <p className='infoText'>"Cannot generate images."</p>
                    <p className='infoText'>"Cannot answer anything happened after 2021."</p>
                </div>    */}
            {/* </div> */}
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