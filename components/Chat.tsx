'use client'

import React from 'react'

type Props = {
    chatId: string;
}

function Chat({chatId}: Props) {
  return (
    <div className='flex-1 border-gray-700 '>Chat</div>
  )
}

export default Chat