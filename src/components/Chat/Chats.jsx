/* eslint-disable react/prop-types */
import  { useState, useEffect,useRef } from 'react';
import './Chats.css'
import Message from './Message' 
function Chats({ id, client, username }) {
  
 
  console.log(username)
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const isFirstRun = useRef(true);
  const messageContainerRef = useRef(null);
  useEffect(() => {
    async function getMessages() {
      try {
        const response = await fetch(`/api/getmessages?chatid=${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          const formattedMessages = data.map(message => ({
            content: message.content,
            sender: message.sender,
            timestamp: new Date(message.timestamp.seconds * 1000) // Convert seconds to milliseconds
          }));
          setMessages(formattedMessages);
        } else {
          console.log("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
    if(id)
    getMessages();
  }, [id]);

  useEffect(() => {
    if (!client) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
    

    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      console.log(parsedMessage)
      if (parsedMessage.type === 'message') {
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      }
    };

    //Cleanup function to close WebSocket connection
    // return () => {
    //   client.close();
    //   console.log("WebSocket connection closed");
    // };
  }
  }, [client]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage =  () => {
    if (client.readyState === WebSocket.OPEN) {
    if (message.trim() !== '') {
      const chatID = id;
      var time = new Date();
      // var timestamp = time.toString()
       var timestamp =  time.toLocaleString([], { hour: '2-digit', minute: '2-digit' })
        console.log('timestamp: ',timestamp) 
      const sender = username;
      console.log("sendr is :",sender)
      const newMessage = {
        type: 'message',
        chatID,
        sender,
        content: message,
        timestamp
      };
      client.send(JSON.stringify(newMessage));
      //setMessages((prevMessages) => [...prevMessages, { type: 'message', content: `You: ${message}` }]);
      setMessage('');
    }
  } else {
    console.warn('WebSocket connection is not open.');
  }
  };
  useEffect(() => {
    // Scroll to the bottom of the message container when messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <>
      <div ref={messageContainerRef} className="message-container">
        {messages.map((msg, index) => (
        
          <Message key={index} content={msg.content} timestamp={msg.timestamp} sender={msg.sender === username ? "You" : msg.sender}   className="message"></Message>
        ))}



      </div>
      <div className="input-container">
      <input
    type="text"
    placeholder="Type your message..."
    value={message}
    onChange={handleMessageChange}
      />
    <button className="sendbutton" onClick={sendMessage}>Send</button>
      </div>
      </>
  );
}

export default Chats;
