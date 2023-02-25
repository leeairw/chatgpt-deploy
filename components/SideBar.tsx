'use client'

import { useSession, signOut } from 'next-auth/react'
import React from 'react'
import NewChat from './NewChat'
import VocabGrammCheck from './VocabGrammCheck'
import { collection } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"
import { db } from '../firebase'
import ChatRow from './ChatRow'

function SideBar() {
  const { data: session } = useSession()
//   {session && console.log('Session available: ', session.user?.image)}
  const [chats, loading, error] = useCollection(
    session && collection(db, "users", session.user?.email!, "chats")
  );
  console.log("Chats Collection: ", chats)
  return (
    <div className='p-2 flex flex-col h-screen'>
        <div className='flex-1'>
            <div className='space-y-2'>

                {/* NewChat */}
                <NewChat/>

                {/* VocabGrammCheck */}
                <VocabGrammCheck/>

                {/* ModelSelection */}

                {/* Map through the ChatRows */}
                {chats?.docs.map(chat => (
                    <div className='pt-1'>
                        <ChatRow key={chat.id} id={chat.id}/>
                    </div>
                ))} 
            </div>
        </div>
        
        {session && (
            <img 
                onClick={() => signOut()}
                src={session.user?.image!}
                alt="Profile Pic"
                className='h-12 w-12 rounded-full cursor-pointer mx-auto mb-2 hover:opacity-50'

            />
        )}

    </div>
  )
}

export default SideBar