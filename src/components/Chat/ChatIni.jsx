import React, { useEffect, useState } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Chat from './Chat';
function ChatIni() {
   
var client

const [id,setid] = useState('')
var username="dan"
var reciever="kevin"
async function getid(){ 
    
    const response = await fetch('/api/getid',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username,reciever})
      })
      const data = await response.json()
      if(response.ok){
        if(data){
          setid(data.id)
          console.log("ID is "+data.id)

        }
      }else{
        console.log('error')
      }
      
}
useEffect(()=>{
    async function ue(){
    console.log("useEffect")
await getid()
console.log(id)
    }
   ue()
},[])
console.log('creating new client')
client = new W3CWebSocket(`ws://localhost:3002?chatID=${id}`)

  return (
    <div><Chat id={id} client={client} username={username} reciever={reciever}/></div>
  )
}

export default ChatIni