/* eslint-disable no-unused-vars */
import { useEffect,useState, useRef } from 'react'
import Chatbox from './Chatbox'
import Sidebar from '../NavBar/Sidebar'

function ChatList() {
  const API = import.meta.env.VITE_REACT_API
    var [chats,setchats] = useState([])
    const [username,setusername] = useState(sessionStorage.getItem("username"))
    useEffect( () => {
        
        const getchats= async ()=>{
            
            const response = await fetch(`${API}/getchats?username=${username}`,{
              method:'GET',
             headers:{
              'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
             }
            })
            const data = await response.json();
            if(response.ok){
             var ch=   data.map(chat=>({
                    id : chat.id,
                    participants : chat.Participants,
                    pfp: chat.pfp?chat.pfp:sessionStorage.getItem('pfp')
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
              
              return <Chatbox key={chat.id} participants={chat.participants} id={chat.id} sender={username} pfp={chat.pfp}/>
              
           })}
          </div>
        </div>
    
 
    
  )
}

export default ChatList