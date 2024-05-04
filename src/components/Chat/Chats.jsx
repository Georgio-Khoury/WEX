/* eslint-disable react/prop-types */
import  { useState, useEffect,useRef } from 'react';
import './Chats.css'
import Message from './Message' 
import EmojiPicker from 'emoji-picker-react';

function Chats({ id, client, username }) {
  const API = import.meta.env.VITE_REACT_API
 
  console.log(username)
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const isFirstRun = useRef(true);
  const messageContainerRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const onEmojiClick = (emojiObject, event) => {
    console.log('Selected emoji:', emojiObject);
    setMessage(prev => prev + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  useEffect(() => {
    async function getMessages() {
      try {
        const response = await fetch(`${API}/getmessages?chatid=${id}`);
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
      console.log('WebSocket Client Connected here');
    };

    client.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      console.log("sender is",parsedMessage.sender)
      if (parsedMessage.type === 'message' && parsedMessage.chatID === id&&parsedMessage.sender!=username) {
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      }
    };

    //Cleanup function to close WebSocket connection
    //return () => {
      // client.close();
      //console.log("WebSocket connection closed");
  //   };
  }
  }, [client]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  function handlekeydown(e) {
    if(e.key === 'Enter') {
     
      sendMessage();
    }
  }
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
      setMessages((prevMessages) => [...prevMessages, newMessage]);
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
    <div className="chat-container" onKeyDown={handlekeydown}>
      <div ref={messageContainerRef} className="message-container"  onKeyDown={handlekeydown}>
        {messages.map((msg, index) => (
        
          <Message key={index} content={msg.content} timestamp={msg.timestamp} sender={msg.sender === username ? "You" : msg.sender}   className="message"></Message>
        ))}



      </div>
      <div className="input-container">
      <button onClick={toggleEmojiPicker} className="emoji-button">😊</button>
        {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
      <input
      className="message-input"
    type="text"
    placeholder="Type your message..."
    value={message}
    onChange={handleMessageChange}
    onKeyDown={handlekeydown}
      />
    <button className="send-button"  onClick={sendMessage} >Send</button>
      </div>
      </div>
  );
}

export default Chats;