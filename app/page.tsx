import React from 'react'

// Notes
// 1. Set things up
//  -- Get OpenAI API: https://platform.openai.com/account/api-keys
//  -- Firebase: https://console.firebase.google.com/project/chatgpt-clone-yt-b13df/overview
//  -- Create Project: https://v2.tailwindcss.com/docs/guides/nextjs
// 2. Trigger the App Directory of Next.js 13
//  -- Head to next.config.js -> type in experimental: {appDir: true,}
//  -- create the /app directory and everything in it is by default server components
//  -- create page.tsx file 
//  -- paste import '../styles/globals.css' to layout.tsx to enable tailwind
// 3. Plan
//  -- Components: Side bar + Main ChatPage

function page() {
  return (
    <div className='flex text-white'>
        <h1 className='text-5xl font-bold mb-20'>ChatGPT</h1>
    </div>
  )
}

export default page