import React from 'react'
import { AcademicCapIcon, DeviceTabletIcon, ShieldExclamationIcon} from '@heroicons/react/24/outline'
// import { AcademicCapIcon, } from '@heroicons/react/24/solid'
import Image from "next/image";

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

function page() {
  return (
    <div className='flex flex-col items-center justify-center h-screen text-white'>
        <div className='flex items-center p-5'>
            <Image 
                // src="https://links.papareact.com/2i6"
                src="https://www.giantbomb.com/a/uploads/scale_medium/0/6087/2437349-pikachu.png"
                width={100}
                height={100}
                alt="logo"
            />    
            <h1 className='text-2xl font-bold'>ChatTime:)</h1>
        </div>
        
        <div>

          <div className='space-y-4 text-center lg:space-y-0 lg:flex lg:space-x-6'>

            {/* Academic Icon */}
            <div className='flex flex-col'>
                <div className='flex flex-col items-center justify-center mb-2'>
                    <div className='flex flex-row space-x-2 items-center'>
                        <AcademicCapIcon className="h-8 w-8 text-purple-400"/><h2>Examples</h2>
                    </div>
                </div>
                <div className='space-y-2'>
                    <p className='infoText'>"What's the difference b/w 'Ser' and 'Está' in Spanish?"</p>
                    <p className='infoText'>"How to say I love you in French?"</p>
                    <p className='infoText'>"Make up a fun dialogue for kids to learn Japanese."</p>
                </div>   
            </div>
            

            {/* Capabilities Icon */}
            <div className='flex flex-col'>
                <div className='flex flex-col items-center justify-center mb-2'>
                    <div className='flex flex-row space-x-2 items-center'>
                        <DeviceTabletIcon className="h-8 w-8 text-purple-400"/><h2>Examples</h2>
                    </div>
                </div>
                <div className='space-y-2'>
                    <p className='infoText'>"Summarize text or explain a concep.t"</p>
                    <p className='infoText'>"Answer questions."</p>
                    <p className='infoText'>"Create content in all languages."</p>
                </div>   
            </div>

            {/* Limitations Icon */}
            <div className='flex flex-col'>
                <div className='flex flex-col items-center justify-center mb-2'>
                    <div className='flex flex-row space-x-2 items-center'>
                        <ShieldExclamationIcon className="h-8 w-8 text-purple-400"/><h2>Limitations</h2>
                    </div>
                </div>
                <div className='space-y-2'>
                    <p className='infoText'>"Cannot answer certain racial and political questions."</p>
                    <p className='infoText'>"Cannot generate images."</p>
                    <p className='infoText'>"Cannot answer anything happened after 2021."</p>
                </div>   
            </div>



          </div>  

        </div>
    </div>
  )
}

export default page