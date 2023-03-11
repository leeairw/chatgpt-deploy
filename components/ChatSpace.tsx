'use client';

import { ArrowDownCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { collection, orderBy, query,serverTimestamp, addDoc  } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, {FormEvent, useState} from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import PastMessage from './PastMessage';
import { AcademicCapIcon, PencilSquareIcon, DeviceTabletIcon, ShieldExclamationIcon} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast';
import useSWR from "swr";
import { takeCoverage } from 'v8';


type Props = {
    chatId: string;
    chatHistory: { role: string; content: string }[];
    addChatHistory: (role: string, content: string) => void;
}

function ChatSpace({chatId, chatHistory, addChatHistory}: Props) {

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
  ]

  // set the model for sample question
  const { data: model, mutate: setModel } = useSWR('model', {
    fallbackData: 'gpt-3.5-turbo'
  });

  // define a function that submits sample question to OpenAI
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
    // console.log("Current sample question: ", sample_question)
    addChatHistory("user", sample_question)
    console.log("Latest ChatHistory: ", chatHistory)

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

  // define a function that allow users to take quick notes
  const sample_note_input = "Today Sean learnt how to talk with past tense in English. He tended to make mistakes in some iregular verbs for past tense."
  // Define the handleKeyDown and takeQuickNote functions and the relevant types and functions
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };
  const [noteInput, setNoteInput] = useState("");
  const takeQuickNote = async(e: FormEvent<HTMLFormElement>) => {
    // set up and return if null
    e.preventDefault()
    if (!noteInput) return;

    // trim the prompt
    // const input = prompt.trim();
    const input_complete = "Note: " + noteInput;
    setNoteInput("");

    // Define the takeQuickNote input format
    const quickNote: Message = {
      text: input_complete,
      createdAt: serverTimestamp(),
      user: {
          _id: session?.user?.email!,
          name: session?.user?.name!,
          type: "UserNote",
          avatar: session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      }
    }
    await addDoc(
        collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'),
        quickNote 
    )
    addChatHistory("user", input_complete)
    console.log("Latest ChatHistory: ", chatHistory)
  }

  return (
    <div className='flex-1 border-gray-700 overflow-y-scroll overflow-x-hidden'>

        {/* Give a notification if there is no chat yet */}
        {messages?.empty && (
          <>
            <p className='mt-10 text-center text-white'>
              Ask me anything! :)
            </p>
            <ArrowDownCircleIcon className='h-10 w-10 mx-auto mt-5 text-white animate-bounce'/>
          </>
        )}

        {messages?.empty && (
          <div className=''>
          <div className='space-y-4 text-center justify-center lg:space-y-0 lg:flex lg:space-x-6 text-white'>

            {/* Academic Icon */}
            <div className='flex flex-col items-center justify-center'>
                <div className='flex flex-col items-center justify-center mb-2'>
                    <div className='flex flex-row space-x-2 items-center'>
                        <AcademicCapIcon className="h-8 w-8 text-purple-400"/><h2>Examples</h2>
                    </div>
                </div>
                <div className='space-y-2 mt-2'>
                   {sample_questions.map((sample_q, ind) => {
                    // console.log("Current sample_q: ", sample_q)
                    const handleClick = async () => {
                      await sendSampleQuestion(sample_q);
                    };
                    return (
                      <div key={ind} onClick={handleClick} className={`sampleQuestionButton`}>
                        <p className=''>{sample_q}</p>
                      </div>
                    )            
                  })}
                </div>   
            </div>
          </div>  
        </div>
        )}

        {/* List all past messages under one chatId */}
        {messages?.docs?.map((message, ind) => (message.data().user.type != "SmartButtonRequest" && (
          <div key={ind + message.id} className="mt-2" >
            <PastMessage  messageId={message.id} 
            chatId={chatId} message={message.data()} />
          </div>
        )))}

        {/* Take quick notes */}
        {<div className='space-y-1 mt-5 text-center justify-center lg:space-y-0 lg:flex lg:space-x-6 text-white'>
            {/* Note Taking Icon */}
            <div className='flex flex-row items-center justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex flex-row space-x-2 items-center'>
                        <PencilSquareIcon className="h-8 w-8 text-purple-400"/>
                    </div>
                </div>
                <div className='justify-center items-center'>
                      {/* Submit text input */}       
                        <form onSubmit={takeQuickNote} className='p-5 space-x-2 flex justify-center items-center '>
                            <textarea 
                                className='textInput resize-none'
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Take a quick note here :)"
                                rows={1}
                            />
                            <button 
                                disabled={!noteInput || !session}
                                type="submit"
                            >
                                <PaperAirplaneIcon className='submitButton'/>
                            </button>
                        </form>
                </div>
            </div>
          </div>}  
    </div>
  )
}

export default ChatSpace



{/* Capabilities Icon */}
{/* <div className='flex flex-col items-center justify-center'>
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
</div> */}

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