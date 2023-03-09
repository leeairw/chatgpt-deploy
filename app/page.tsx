import React from 'react'
// import { AcademicCapIcon, } from '@heroicons/react/24/solid'
import Image from "next/image";
import NewChat from '../components/NewChat'


// Notes
// 1. Set things up
//  -- Get OpenAI API: https://platform.openai.com/account/api-keys
//  -- Firebase: https://console.firebase.google.com/project/chatgpt-clone-yt-b13df/overview
//  -- Create Project: https://v2.tailwindcss.com/docs/guides/nextjs
//  -- Search for Icons: https://heroicons.com/; npm  install @heroicons/react
// 2. Trigger the App Directory of Next.js 13
//  -- Head to next.config.js -> type in experimental: {appDir: true,}
//  -- create the /app directory and everything in it is by default server components
//  -- create page.tsx file 
//  -- paste import '../styles/globals.css' to layout.tsx to enable tailwind
// 3. Plan
//  -- Components: Side bar + Main ChatPage
// 4. Set up @layer in styles/global.css
// 5. Create a components folder
// 6. Go install nextauth
//  -- sudo npm install next-auth
//  -- Go to Firebase --> Build / Authentication --> Copy your web client ID and secret
// 7. Create firebase.ts file
//  -- Install firebase: sudo npm install firebase
// 8. Install react firebase hooks
//  -- https://www.npmjs.com/package/react-firebase-hooks
// 9. Create a typings.d.ts to define Message interface data types
// 10. npm add react-hot-toast
// 11. sudo npm install openai
// 12. Create firebaseAdmin.ts
//  -- sudo npm install firebase-admin
//  -- firebase > Project Oveview > Project settings > Service accounts > Firebase Admin SDK > Generate new private key
//  -- Download the file and then pull it to our env
//  -- https://www.textfixer.com/tools/remove-line-breaks.php
//  -- Use the website above to remove line breaks and paste it to .env.local as a param called FIREBASE_SERVICE_ACCOUNT_KEY
// 13. select models: sudo npm install react-select and create an api called getEngine.ts
// 14. Do useSWR from vercel: swr.vercel.app; it's a react hook for data fetching
//  -- sudo npm install swr
// 15. Use Vercel CLI to deploy: sudo npm install -g vercel
//  -- vercel

function page() {
  return (
    <div className='flex flex-col items-center justify-center h-screen '>
        <div className='flex flex-col p-5'>
            <div className='flex flex-row items-center justify-center space-x-2'>
                <Image 
                    // src="https://links.papareact.com/2i6"
                    src="https://www.giantbomb.com/a/uploads/scale_medium/0/6087/2437349-pikachu.png"
                    width={200}
                    height={200}
                    alt="logo"
                />
                <div className='border-gray-700 border text-gray-500 mt-2 pageButton text-2xl'>
                    <NewChat/>
                </div>
            </div>
            <h1 className='text-md mt-5 text-gray-500 text-2xl'>Welcome to Smart Lingo, your langauge teaching copilot :)</h1>
        </div>
    </div>
  )
}

export default page