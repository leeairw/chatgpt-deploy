'use client'

import useSWR from "swr";
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { FormEvent, useState } from 'react'
import { toast } from 'react-hot-toast';
import { db } from '../firebase';
import ModelSelection from './ModelSelection';


type Props = {
    chatId: string;
}

function ChatInput({chatId}: Props) {

  const [prompt, setPrompt] = useState("");
  const {data:session} = useSession();

  // useSWR to get model
  // const model = 'text-davinci-003';
  const { data: model} = useSWR("model", {
    fallbackData: 'text-davinci-003'
  })
  

  const sendInput = async(e: FormEvent<HTMLFormElement>) => {
    // set up and return if null
    e.preventDefault()
    if (!prompt) return;

    // trim the prompt
    // const input = prompt.trim();
    const input = prompt;
    setPrompt("");

    // Define the Message input format
    const message: Message = {
        text: input,
        createdAt: serverTimestamp(),
        user: {
            _id: session?.user?.email!,
            name: session?.user?.name!,
            avatar: session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`,
        }
    }

    // Add the new message to firebase
    await addDoc(
        collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'),
        message 
    )

    // Toast notification to say Loading
    const notification = toast.loading('Smart Lingo is thinking...')

    // fetch and send success notification
    await fetch('/api/askQuestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            prompt: input, chatId, model, session
        }),
    }).then(() => {
        // Toast notificaion to say successful!
        toast.success("Smart Lingo has responded!", {
            id: notification,
        })
    })

  };

  return (
    <div className='bg-transparent text-gray-400 rounded-lg text-sm focus:outline-none'>
        {/* Submit text input */}
        <form onSubmit={sendInput} className='p-5 space-x-2 flex'>
            <input 
                className='textInput'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                type="text"
                placeholder="Type in your language input here :)"
            />

            <button 
                disabled={!prompt || !session}
                type="submit"
            >
                <PaperAirplaneIcon className='submitButton'/>
            </button>
        </form>

        <div className='md:hidden'>
            {/* Model Selection on smaller screen */}
            <ModelSelection />
        </div>
    </div>
  )
}

export default ChatInput;

