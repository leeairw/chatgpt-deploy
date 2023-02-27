'use client'

import React from 'react'

type Props = {
    chatId: string;
}

function Chat({chatId}: Props) {
  return (
    <div className='border-gray-700 border pageButton'>Chat</div>
  )
}

export default Chat