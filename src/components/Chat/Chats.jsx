/* eslint-disable react/prop-types */
import React, { useState, useEffect,useRef } from 'react';
import './Chats.css'
import Message from './Message'
function Chats({ id, client, username }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const isFirstRun = useRef(true);
  useEffect(() => {
    async function getMessages() {
      try {
        const response = await fetch(`/api/getmessages?chatid=${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          // const msgs = data.map((message) => {
          //   return message.content;
          // });
          // console.log(messages)
          // setMessages((prevMessages) => [...prevMessages, { type: 'message', content: msgs }]);
          // console.log("the messages are ",{messages})
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

  const sendMessage = () => {
    if (client.readyState === WebSocket.OPEN) {
    if (message.trim() !== '') {
      const chatID = id;
      var time = new Date();
        var timestamp = time.toString()
        console.log('timestamp: ',timestamp) 
      const sender = username;
      const newMessage = {
        type: 'message',
        chatID,
        sender,
        content: message,
        timestamp
      };
      client.send(JSON.stringify(newMessage));
      setMessages((prevMessages) => [...prevMessages, { type: 'message', content: `You: ${message}` }]);
      setMessage('');
    }
  } else {
    console.warn('WebSocket connection is not open.');
  }
  };

  return (
    <div className="App">
      <div className="message-container">
        {messages.map((msg, index) => (
          <Message key={index} content={msg.content} sender={msg.sender}   className="message">{msg.sender === id ? `You: ${msg.content}` : msg.content}></Message>
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

export default Chats;
