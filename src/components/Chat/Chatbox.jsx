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
    return receiver;
  }
  useEffect(()=>{
      const rec= assignReceiver(sender,participants)
     setreceiver(rec)
    sessionStorage.setItem("receiver",rec)
    sessionStorage.setItem("username",sender)
  },[])
   function enterchat(){
  
 
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
