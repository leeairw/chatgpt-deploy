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
}

function VocabGrammCheck({chatId}: Props) {
  const router = useRouter();
  const { data:session } = useSession();
  const { data: model, mutate: setModel } = useSWR('model', {
    fallbackData: 'text-davinci-003'
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
    messages?.docs.forEach((message) => (
        pastMessages.push(message.data().text.replace(/(\r\n|\n|\r)/gm,""))
        // console.log(message.data().text)
    ));
    console.log("Log the messages Array: ", pastMessages);
    

    const prompt_VocabGrammCheck = 'Please find the grammar or vocabulary mistakes made in the following text, and list them in bullet points: \n\n' + '"' + pastMessages.toString() + '"'
    console.log("Log the messages String: ", prompt_VocabGrammCheck);

    // Define the Message input format
    const prompt_prompt_VocabGrammCheck_formatted: Message = {
        text: prompt_VocabGrammCheck,
        createdAt: serverTimestamp(),
        user: {
            _id: session?.user?.email!,
            name: session?.user?.name!,
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

        // Toast notification to say Loading
        const notification = toast.loading('Smart Lingo is thinking...')
        await fetch('/api/askQuestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                prompt: prompt_prompt_VocabGrammCheck_formatted, chatId, model, session
            }),
        }).then(() => {
            // Toast notificaion to say successful!
            toast.success("Smart Lingo has responded!", {
                id: Notification,
            })
        })

    }
    


  return (
    <div onClick={sendButtonRequest} className='border-gray-700 border pageButton'>
        <PlusIcon className='h-4 w-4'/>
        <p className='truncate'>Check Vocab and Grammar</p>
    </div>
  );
}

export default VocabGrammCheck;
