'use client'

import { useSession, signOut } from 'next-auth/react'
import React from 'react'
import NewTask from './NewTask'

function SideBar() {
  const { data: session } = useSession()
//   {session && console.log('Session available: ', session.user?.image)}
  
  return (
    <div className='p-2 flex flex-col h-screen'>
        <div className='flex-1'>
            <div>

                {/* NewTask */}
                <NewTask/>

                {/* ModelSelection */}

                {/* Map through the ChatRows */}
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