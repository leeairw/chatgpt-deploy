'use client'

import useSWR from "swr";
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { FormEvent, KeyboardEvent, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { db } from '../firebase';
import ModelSelection from './ModelSelection';
import UploadFile from './UploadFile';


type Props = {
    chatId: string;
    chatHistory: { role: string; content: string }[];
    addChatHistory: (role: string, content: string) => void;
}

function ChatInput({chatId, chatHistory, addChatHistory}: Props) {

  const [prompt, setPrompt] = useState("");
  const {data:session} = useSession();

  // useSWR to get model
  // const model = 'text-davinci-003';
  const { data: model} = useSWR("model", {
    fallbackData: 'gpt-3.5-turbo'
  })
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };
  // Define the handleSubmit function and the relevant types and functions
  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
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
            type: "UserRequest",
            avatar: session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`,
        }
    }

    // Add the new message to firebase
    await addDoc(
        collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'),
        message 
    )

    
    console.log("Previous ChatHistory: ", ...chatHistory)
    console.log("Current User Input: ", input)
    addChatHistory("user", input || "No Question sent yet")
    

    // Toast notification to say Loading
    const notification = toast.loading('Smart Lingo is thinking...')

    // fetch and send success notification
    const res_openAI = await fetch('/api/askQuestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            prompt: message, chatId, model, session, chatHistory
        }),
    })

    const res_text = await res_openAI.json()
    console.log("Response from AI: ", res_text.answer)
    if (res_text && res_text.answer) {
        // Toast notificaion to say successful!
        toast.success("Smart Lingo has responded!", {
            id: notification,
        })
    }
    addChatHistory("assistant", res_text.answer || "no response!")
    console.log("Latest ChatHistory with assistant response: ", ...chatHistory)

  };

  return (
    <div className=' bg-transparent text-gray-400 rounded-lg text-sm focus:outline-none'>
        {/* Submit text input */}
        <form onSubmit={handleSubmit} className='p-5 space-x-2 flex'>
            <textarea 
                className='textInput resize-none'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type in your language input here :)"
                rows={1}
            />

            <button 
                disabled={!prompt || !session}
                type="submit"
            >
                <PaperAirplaneIcon className='submitButton'/>
            </button>
            <UploadFile chatId={chatId}/>
        </form>

        <div className='md:hidden'>
            {/* Model Selection on smaller screen */}
            <ModelSelection />
        </div>
    </div>
  )
}

export default ChatInput;

