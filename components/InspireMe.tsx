
'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import { addDoc, collection, doc, getDoc, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
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
    const inspireUserWorkflow = async(inspireQ: string, choices: string[]) => {
      // Define the Message input format
      const message: Message = {
        text: inspireQ,
        createdAt: serverTimestamp(),
        user: {
            _id: session?.user?.email!,
            name: inspireQ,
            type: "InspireMeRequest",
            user_choices: choices,
            user_action: "",
            avatar: "https://www.giantbomb.com/a/uploads/scale_medium/0/6087/2437349-pikachu.png",
        }
      }

      // Add the new message to firebase
      const docRef = await addDoc(
          collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'),
          message
      );

      return docRef.id;
    }

    // run through the list of questions and add to firebase
    const sendButtonRequest = async() => {
      const inspireQ_array = [
        {"Q": "How may I help you today? :)", "choices": ["Write a story", "Write a dialogue", "Text input"]},
        {"Q": "What is your student's age group?", "choices": ["6-11", "12-17", "18-25", "26+"]},
        {"Q": "What topics would you like to get inspired on?", "choices": ["Text input"]},
        {"Q": "Any grammar you'd like to highlight in your teaching?", "choices": ["Past tense", "Future tense", "Attribution Clause", "Text input"]},
        {"Q": "Any Vocabulary you'd like to highlight in your teaching?", "choices": ["Text input"]},
      ]

      // Start Ask the question in a loop
      inspireQ_array.forEach((inspireQ) => {
        console.log('inspireQ: ', inspireQ);
        inspireUserWorkflow(inspireQ["Q"], inspireQ["choices"]); 
        // console.log("current messageId (in Loop): ", messageId) 
      })
    }

    // form a question and ask OpenAI
    const inspireMeAnswersArray: any[] = [];
    const [inspireMeAnswers] =  useCollection(
      session &&
      query(
          collection(db, "users", session?.user?.email!, "chats", chatId, "messages"),
          where("user.type", "==", "InspireMeRequest")
    ));
  //   inspireMeAnswers?.docs.forEach((inspireMeAnswer) => (
  //     (message.data().user.name === session?.user?.name || message.data().user.name ==='SmartLingo') && (
  //     pastMessages.push(message.data().user.name + ' said: " ' + message.data().text.replace(/(\r\n|\n|\r)/gm,"") + '"')
  //     // console.log(message.data().text)
  // )));
  //   // const prompt_inspire_me = 'Please summarize the following context in bullet points: ' + pastMessages.toString()
  //   console.log("Log the messages String: ", inspireMeAnswers?.docs.toString());

    // // Define the Message input format
    // const prompt_summarize_formatted: Message = {
    //     text: prompt_summarize,
    //     createdAt: serverTimestamp(),
    //     user: {
    //         _id: session?.user?.email!,
    //         name: "Summary", 
    //         type: "SmartButtonRequest",
    //         user_choices: [],
    //         user_action: "",
    //         avatar: session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`,
    //     }
    // }

    // console.log("Log the messages formatted: ", prompt_summarize_formatted);

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