'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { db } from '../firebase';

type Props = {
    chatId: string;
}


// Brainstorm
// 1. Be the 'co-pilot' for the teacher to generate the best prompt (help them ask the right questions) -> got this idea from how Morris generated Minions Mindblown
// 2. Pretrain model on novels: 
//  -- https://www.lennysnewsletter.com/p/i-built-a-lenny-chatbot-using-gpt
//  -- http://www.lennybot.com/


// To Do:
// 1. addDoc a messge to firebase and make its type to be "InspireMeRequest"
// 2. create a "InspireMeRequest" type response in "PastMessage", with clickable buttons for selecting answers
// 3. wrap up all answers -> form a question -> push to api/askQuestions.ts -> fetch answer and addDoc to firebase as type "InspireMeResponse"


function InspireMe({chatId}: Props) {
    const {data:session} = useSession();

    // Define a function to store InspireMeRequest records to Firebase
    const write_machine_question = async(inspireQ: string) => {
      // Define the Message input format
      const message: Message = {
        text: inspireQ,
        createdAt: serverTimestamp(),
        user: {
            _id: session?.user?.email!,
            name: inspireQ,
            type: "InspireMeRequest",
            avatar: "https://www.giantbomb.com/a/uploads/scale_medium/0/6087/2437349-pikachu.png",
        }
        }
      // Add the new message to firebase
      await addDoc(
          collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'),
          message
          )
    }

    // run through the list of questions and add to firebase
    const sendButtonRequest = async() => {
      const inspireQ_array = [
        "How may I help you today? :)",
        "What is your student's age group?",
        "What topics would you like to get inspired on?",
        "Any grammar you'd like to highlight in your teaching?",
        "Any Vocabulary you'd like to highlight in your teaching?",
      ]

      const inspireQ_json = {
        "How may I help you today? :)": "haha",
        "What is your student's age group?": "haha",
        "What topics would you like to get inspired on?": "haha",
        "Any grammar you'd like to highlight in your teaching?": "haha",
        "Any Vocabulary you'd like to highlight in your teaching?": "haha",
      }

      // Start Ask the question
      inspireQ_array.forEach((inspireQ) => {
        console.log('inspireQ: ', inspireQ);
        write_machine_question(inspireQ);
      })
    }

  return (
    <div 
      onClick={sendButtonRequest} 
      className='border-gray-700 border pageButton'
    >
        <PlusIcon className='h-4 w-4'/>
        <p className='truncate'>Inspire Me</p>
    </div>
  )
}

export default InspireMe