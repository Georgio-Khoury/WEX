/* eslint-disable react/prop-types */
import React from 'react';
import './Message.css'; // Import CSS file for styling

function Message({ content, sender}) {
  // Format timestamp as desired, for example:
  
  

  return (
    <div className="message-box">
      <p className="message-sender">{sender}</p>
      <div className="message-content">{content}</div>
      {/* <p className="message-timestamp">{timestamp}</p> */}
    </div>
  );
}

export default Message;
