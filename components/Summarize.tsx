'use client';

import { PlusIcon } from '@heroicons/react/24/solid'
import { addDoc, collection, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/router' -- DO NOT USE
import { useRouter } from 'next/navigation'
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

type Props = {
    chatId: string;
}

function Summarize({chatId}: Props) {
  const router = useRouter();
  const { data:session } = useSession();

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
    messages?.docs.forEach((message) => (
        pastMessages.push(message.data().user.name + ': ' + message.data().text)
        // console.log(message.data().text)
    ));
    console.log("Log the messages Array: ", pastMessages)

  
  // Summarize the array
  // 1. formulate the question
  // 2. send the question and the array context to AI, with user's name being "ButtonRequest"
  // 3. retrieve the answer from AI 
  const Summarize = async() => {
    const doc = await addDoc(
        collection(db, 'users', session?.user?.email!, 'summary'), {
            userId: session?.user?.email!,
            createdAt:serverTimestamp()
        }
    );
  };

  return (
    <div onClick={Summarize} className='border-gray-700 border pageButton'>
        <PlusIcon className='h-4 w-4'/>
        <p className='truncate'>Summarize</p>
    </div>
  );
}

export default Summarize;