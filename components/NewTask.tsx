import { PlusIcon } from '@heroicons/react/24/solid'
import React from 'react'

function NewTask() {
  return (
    <div className='border-gray-700 border chatRow'>
        <PlusIcon className='h-4 w-4'/>
        <p>New Task</p>
    </div>
  )
}

export default NewTask