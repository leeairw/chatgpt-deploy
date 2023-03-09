'use client'

import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { collection, deleteDoc, doc, orderBy, query, limit } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import path from 'path';
import React, { useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

type Props = {
    id:string;
    first_sess_url: string;
    second_sess_url:string;
    prev_url:string;
};

function SideBarRow({id, first_sess_url,second_sess_url, prev_url}: Props) {

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

  // // query the latest chat
  // const query_latest_session = () => {
  //   const [latest_session] = useCollection(
  //     session &&
  //     query(
  //         collection(db, "users", session.user?.email!, "chats"),
  //         orderBy("createdAt", "desc"),
  //         limit(1)
  //     )
  //   );
  //   console.log("Latest Session's Chat ID: ", latest_session?.docs[0].id)
  //   return latest_session;
  // }

  // delete chat
  const removeChat = async() => {
    await deleteDoc(
        doc(db, "users", session?.user?.email!, "chats", id)
    )
    // deleting first session but there is no second sess yet, then push to "/"
    "chat/"+id === first_sess_url && second_sess_url === "chat/undefined" ? router.push(`/`) : (null);
    // deleting first session but there IS a second sess yet, then push to second_sess_url
    "chat/"+id === first_sess_url && second_sess_url != "chat/undefined" ? router.push(`/`+second_sess_url) : null;
    // If not deleting the first session, then just return the previous session 
    "chat/"+id != first_sess_url ? router.push(`/`+prev_url) : null;

    // router.push(`/`+prev_url); //push to origin url after deleting a chat
  };
  
  return (
    <Link href={`chat/${id}`} className={`chatRow justify-center border-gray-700 border ${smartLingoActive && "bg-gray-700/50"}`}>
        <div className='flex space-x-1 '>   
            <ChatBubbleLeftIcon className='h-5 w-5 text-white'/>
            <p className='hidden md:truncate md:text-clip md:block md:inline-text md:text-white md:justify-center md:text-center md:flex-grow'>
                {/* Pull the first 5 words of the text, or just say 'New Chat' */}
                {messages?.docs[messages?.docs.length - 1]?.data().text.split(' ').slice(0, 5).join(" ") || "New Student"}
            </p>
            <TrashIcon onClick={removeChat} className='shrink-0 h-5 w-5 text-gray-700 hover:text-red-700'/>
        </div>
    </Link>
  )
};

export default SideBarRow;