import React from 'react'
import NewTask from './NewTask'

function SideBar() {
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
    </div>
  )
}

export default SideBar