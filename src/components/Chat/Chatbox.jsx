/* eslint-disable react/prop-types */

//this component will render the chats (not messages)
import { useEffect,useState } from 'react';
import './Chatbox.css'
import { useNavigate } from 'react-router-dom';
function Chatbox({ id, participants,sender }) {
  const [receiver, setreceiver] = useState('');
  const navigate = useNavigate()
  function assignReceiver(sender, participants) {
    let receiver;
    participants.forEach(participant => {
      if (participant !== sender) {
        receiver = participant;
      }
    });
    return receiver?receiver:sender;
  }
  useEffect(()=>{
      const rec= assignReceiver(sender,participants)
     setreceiver(rec)
    sessionStorage.setItem("receiver",rec)
   
  },[])
   function enterchat(){
    const rec= assignReceiver(sender,participants)
    setreceiver(rec)
   sessionStorage.setItem("receiver",rec)
    
  navigate("/chatinit")
}
  return (
    <div className="chatbox" onClick={enterchat} >
      <div>ID: {id}</div>
      <div>Participant: {receiver}</div>
    </div>
  );
}

export default Chatbox;
