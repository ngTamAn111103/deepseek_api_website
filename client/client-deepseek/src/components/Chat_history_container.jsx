import React from 'react'
import Chat_history_item from './Chat_history_Item'


function Chat_history_container() {
  return (
    <div className='bg-gray-400 w-52 h-screen flex flex-col items-center'>
      <button className='bg-blue-300 w-32 py-5 rounded-2xl my-4'>New chat</button>
      <div className="">
        <Chat_history_item/>
        <Chat_history_item/>
        <Chat_history_item/>
        <Chat_history_item/>
        <Chat_history_item/>
      </div>

    </div>
  )
}

export default Chat_history_container
