/* eslint-disable no-unused-vars */
import { useEffect,useState, useRef } from 'react'
import Chatbox from './Chatbox'
import Sidebar from '../NavBar/Sidebar'

function ChatList() {
    var [chats,setchats] = useState([])
    const [username,setusername] = useState(sessionStorage.getItem("username"))
    useEffect( () => {
        
        const getchats= async ()=>{
            
            const response = await fetch(`/api/getchats?username=${username}`)
            const data = await response.json();
            if(response.ok){
             var ch=   data.map(chat=>({
                    id : chat.id,
                    participants : chat.Participants
                }))
                setchats(ch)   
            }
        }
        getchats();
    },[])
     
  return (
    
    <div className='page-container'>
    <Sidebar/>
        <div className='content'>
        {chats.map(chat=>{
              
              return <Chatbox key={chat.id} participants={chat.participants} id={chat.id} sender={username}/>
              
           })}
          </div>
        </div>
    
 
    
  )
}

export default ChatList