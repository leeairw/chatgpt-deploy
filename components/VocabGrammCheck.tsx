'use client';

import { PlusIcon } from '@heroicons/react/24/solid'
import { addDoc, collection, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/router' -- DO NOT USE
import { useRouter } from 'next/navigation'
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import useSWR from "swr";
import toast from 'react-hot-toast';

type Props = {
  chatId: string;
  chatHistory: { role: string; content: string }[];
  addChatHistory: (role: string, content: string) => void;
}

function VocabGrammCheck({chatId, chatHistory, addChatHistory}: Props) {
  const router = useRouter();
  const { data:session } = useSession();
  const { data: model} = useSWR('model', {
    fallbackData: 'text-davinci-001'
  });

  // Query all messages under this one chatId (imagine this is all history of one student)
  // Try to get collection of messages and covert to array
  // Combine the documents to one single string
    const pastMessages: any[] = [];
    const [messages] =  useCollection(
        session &&
        query(
            collection(db, "users", session?.user?.email!, "chats", chatId, "messages"),
            orderBy("createdAt", "asc")
        )
    );

    // console.log("Session user's name: ", session?.user?.name)
    // console.log("Check message's user name: ", messages?.docs[4]?.data()?.user?.name)

    messages?.docs.forEach((message) => (
      // make sure that you don't pull "button requested" messages
       (message.data().user.name === session?.user?.name || message.data().user.name ==='SmartLingo') 
       && (message.data().user._id != "SmartLingo")
       && (
        pastMessages.push(message.data().text.replace(/(\r\n|\n|\r)/gm,""))
        // console.log(message.data().text)
      )
        
    ));
    // console.log("Log the messages Array: ", pastMessages);
    

    const prompt_VocabGrammCheck = 
      'Please find the grammar or vocabulary mistakes made in the following text, and list them in bullet points.' 
      // + 'After that, please also write down the correct answer right next to each mistake in the original text. \n\n'
      + '"' + pastMessages.toString() + '"'
    // console.log("Log the messages String: ", prompt_VocabGrammCheck);

    // Define the Message input format
    const prompt_prompt_VocabGrammCheck_formatted: Message = {
        text: prompt_VocabGrammCheck,
        createdAt: serverTimestamp(),
        user: {
            _id: session?.user?.email!,
            name: "VocabGrammCheck",
            type: "SmartButtonRequest",
            avatar: session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`,
        }
    }
  
  // Check the array
  // 1. formulate the question
    // fetch and send success notification
  // 2. send the question and the array context to AI, with user's name being "ButtonRequest"
    // Add the new message to firebase
  // 3. retrieve the answer from AI 

    const sendButtonRequest = async() => {

        await addDoc(
            collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'),
            prompt_prompt_VocabGrammCheck_formatted 
        )

        addChatHistory("user", prompt_VocabGrammCheck)

      // fetch and send success notification
      const res_openAI = await fetch('/api/askQuestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            prompt: prompt_VocabGrammCheck, chatId, model, session, chatHistory
        }),
      })

      // Toast notification to say Loading
      const notification = toast.loading('Smart Lingo is thinking...')
      const res_text = await res_openAI.json()
      console.log("Response: ", res_text)
      if (res_text && res_text.answer) {
          // Toast notificaion to say successful!
          toast.success("Smart Lingo has responded!", {
              id: notification,
          })
      }
      // addChatHistory("assistant", res_text)
      console.log("Latest ChatHistory: ", ...chatHistory)
    }
    


  return (
    <div onClick={sendButtonRequest} className={`border-gray-700 border pageButton ${pastMessages.toString().trim() === "" && "hidden"}`}>
        <PlusIcon className='h-4 w-4'/>
        <p className='truncate'>Check Vocab and Grammar</p>
    </div>
  );
}

export default VocabGrammCheck;
