import React, { useEffect, useRef } from 'react'

function ChatList() {
    var chats = useRef("")
    useEffect( () => {
        const username='Dan'
        const getchats= async ()=>{
            console.log('on')
            const response = await fetch(`/api/getchats?username=${username}`)
            const data = await response.json();
            if(response.ok){
             chats.current=   data.map(chat=>({
                    id : chat.id,
                    participants : chat.Participants
                }))
                console.log(chats)
            }
        }
        getchats();
    },[])

  return (
    <div>{chats.current[0].participants[0]}</div>
  )
}

export default ChatList