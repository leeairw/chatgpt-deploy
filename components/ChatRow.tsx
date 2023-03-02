'use client'

import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { collection, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import path from 'path';
import React, { useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

type Props = {
    id:string;
};

function ChatRow({id}: Props) {

  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [smartLingoActive, setSmartLingoActive] = useState(false);
  


  const [messages] = useCollection(
        collection(db, "users", session?.user?.email!, "chats", id, "messages")
  );

  // dynamically check if the pathname has an id - chat being clicked on
  useEffect(() => {
    if (!pathname) return;
    setSmartLingoActive(pathname.includes(id));
    }, [pathname]);

  // delete chat
  const removeChat = async() => {
    await deleteDoc(
        doc(db, "users", session?.user?.email!, "chats", id)
    )
    router.push(`/`); //push to origin url after deleting a chat
  }
  
  
  return (
    <Link href={`chat/${id}`} className={`chatRow justify-center border-gray-700 border ${smartLingoActive && "bg-gray-700/50"}`}>
        <div className='flex space-x-1 '>   
            <ChatBubbleLeftIcon className='h-5 w-5 text-white'/>
            <p className=' hidden md:truncate md:text-clip md:block md:inline-text md:text-white md:justify-center md:text-center'>
                {/* Pull the first 5 words of the text, or just say 'New Chat' */}
                {messages?.docs[messages?.docs.length - 1]?.data().text.split(' ').slice(0, 5).join(" ") || "New Student"}
            </p>
            <TrashIcon onClick={removeChat} className='shrink-0 h-5 w-5 text-gray-700 hover:text-red-700'/>
        </div>
    </Link>
    
  )
}

export default ChatRow