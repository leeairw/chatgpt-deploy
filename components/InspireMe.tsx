import { PlusIcon } from '@heroicons/react/24/outline'
import React from 'react'

type Props = {
    chatId: string;
}

function InspireMe({chatId}: Props) {

    const sendButtonRequest = async() => {
    }

  return (
    <div 
    // onClick={sendButtonRequest} 
    className='border-gray-700 border pageButton'>
        <PlusIcon className='h-4 w-4'/>
        <p className='truncate'>Inspire Me</p>
    </div>
  )
}

export default InspireMe