/* eslint-disable react/prop-types */
// App.js
import { useState, useEffect } from 'react';
import '../../App.css';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
 

// console.log('wtf')
// var client
// var id
// var username="dan"
// var reciever="kevin"
// const response = await fetch('/api/getid',{
//   method:'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({username,reciever})
// })
// const data = await response.json()
// if(response.ok){
//   if(data){
//     id = data.id
//   }
// }else{
//   console.log('error')
// }
// client = new W3CWebSocket(`ws://localhost:3002?chatID=${id}`)


function  Chat(props) {
  console.log('rerenderer')
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

 const {id,client,username} = props
console.log("id is", id)
console.log("client is", client)
console.log("username is ",username)
  
  useEffect(()=>{
    async function getmessages(){
    const response = await fetch(`/api/getmessages?chatid=${id}`)
    const data = await response.json();
    if(response.ok){
      const msgs = data.map((message)=>{
        return message.content
      })
      console.log(msgs)
      setMessages(prevMessages => [...prevMessages, { type: 'message', content: msgs }]);
      console.log(messages)
    }else{
      console.log("failed ")
    }

    }
    getmessages()
  },[])

  

 
  
  useEffect(() => {
   console.log('entered use effect')
    
    
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      
     
      const parsedMessage = JSON.parse(message.data);
      console.log(parsedMessage)
      if (parsedMessage.type === 'message') {
        setMessages(prevMessages => [...prevMessages, parsedMessage]);
      }
    };
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
     const chatID= id
      const sender= username
      const newMessage = {
        type: 'message',
        chatID,
        sender,
        content: message
      };
      client.send(JSON.stringify(newMessage));
     setMessages(prevMessages => [...prevMessages, { type: 'message', content: `You: ${message}` }]);
      setMessage('');
    }
  }

  return (
    <div className="App">
      <div className="message-container">
      {messages.map((msg, index) => (
          <div key={index}>{msg.sender === id ? `You: ${msg.content}` : msg.content}</div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={handleMessageChange}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
