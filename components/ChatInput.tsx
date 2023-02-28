'use client'

import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import React, { FormEvent, useState } from 'react'

type Props = {
    chatId: string;
}

function ChatInput({chatId}: Props) {

  const [prompt, setPrompt] = useState("");
  const session = useSession();

  const sendInput = async(e: FormEvent<HTMLFormElement>) => {

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

        <div>
            {/* Model Selection */}
        </div>
    </div>
  )
}

export default ChatInput