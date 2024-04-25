/* eslint-disable react/prop-types */
import React from 'react';
import './Message.css'; // Import CSS file for styling

function Message({ content, sender,timestamp}) {
  timestamp = timestamp.toLocaleString([], { hour: '2-digit', minute: '2-digit' })
  
  

  return (
    <div className="message-box">
      <p className="message-sender">{sender}</p>
      <div className="message-content">{content}</div>
      <p className="message-timestamp">{timestamp}</p>
    </div>
  );
}

export default Message;
