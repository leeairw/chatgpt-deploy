'use client'

import React from 'react'
import {signIn} from "next-auth/react";
import Image from "next/image";

function LogIn() {
  return (
    <div className='bg-gradient-to-br from-purple-300 to-yellow-300 h-screen flex flex-col items-center justify-center text-center'>
        <Image 
            // src="https://links.papareact.com/2i6"
            src="https://www.giantbomb.com/a/uploads/scale_medium/0/6087/2437349-pikachu.png"
            width={300}
            height={300}
            alt="logo"
        />
        <button onClick={() => signIn()} className='text-white font-bold text-3xl animate-pulse p-2'>
            Sign In to Smart Lingo
        </button>
    </div>
  )
}

export default LogIn