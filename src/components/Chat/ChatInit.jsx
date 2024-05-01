import { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import Chats from './Chats';
import Sidebar from '../NavBar/Sidebar';

function ChatInit() {
  const [id, setId] = useState('');
  const [client, setClient] = useState(null); // State to hold WebSocket client
  const[user,setusername] = useState('')
  const [rec,setreciever] = useState('')
  

  useEffect(() => {
    // Function to fetch ID and create WebSocket client
    async function fetchDataAndCreateClient() {
      try {
        const username = sessionStorage.getItem("username")
        const reciever = sessionStorage.getItem("receiver")
        setusername(sessionStorage.getItem("username"))
        setreciever(sessionStorage.getItem("receiver"))
        console.log("res",reciever)
        console.log("sender",username)
        console.log("Fetching ID...");
        const response = await fetch('/api/getid', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          }, 
          body: JSON.stringify({ username, reciever })
        });
        const data = await response.json();
        if (response.ok && data && data.id) {
          setId(data.id);
          console.log("ID is " + data.id);

          // Create WebSocket client with the fetched ID
          
          const newClient = new W3CWebSocket(`ws://localhost:3002?chatID=${data.id}`);
          setClient(newClient);
          console.log("WebSocket client created");
        } else {
          console.error('Error fetching ID');
        }
      } catch (error) {
        console.error('Error fetching ID:', error);
      }
    }

    // Call the function to fetch ID and create WebSocket client
    fetchDataAndCreateClient();

    // Clean up function to close WebSocket connection when component unmounts
    return () => {
      if (client) {
        client.close();
        console.log("WebSocket connection closed");
      }
    };
  }, []); // Run only on component mount

  return (
    <div className='page-container'>
      <Sidebar/>
    <div className='content'>
      {/* Render the Chat component with the ID and WebSocket client */}
      <Chats id={id} client={client} username={user} reciever={rec} />
      </div>
    </div>
  );
}

export default ChatInit;
