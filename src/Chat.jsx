// App.js
import { useState, useEffect } from 'react';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const client = new W3CWebSocket('ws://localhost:3002?chatID=dankevin');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
      const parsedMessage = JSON.parse(message.data);
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
      const chatId = 'dankevin'; // Replace with actual chat ID
      const sender = 'USER_ID'; // Replace with actual user ID
      const newMessage = {
        type: 'message',
        chatId,
        sender,
        content: message
      };
      client.send(JSON.stringify(newMessage));
      setMessages(prevMessages => [...prevMessages, { type: 'message', content: `You: ${message}` }]);
      setMessage('');
    }
  };

  return (
    <div className="App">
      <div className="message-container">
      {messages.map((msg, index) => (
          <div key={index}>{msg.sender === 'USER_ID' ? `You: ${msg.content}` : msg.content}</div>
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

export default App;
