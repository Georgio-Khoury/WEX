/* eslint-disable react/prop-types */

//this component will render the chats (not messages)
import { useEffect,useState } from 'react';
import './Chatbox.css'
import { useNavigate } from 'react-router-dom';
function Chatbox({ id, participants,sender,pfp }) {
  const [receiver, setreceiver] = useState('');
  const [newmsgs,setnew] = useState(0)
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
    let count = sessionStorage.getItem(id)
    if(count!=null){
      setnew(count)
    }
   
  },[])
   function enterchat(){
    const rec= assignReceiver(sender,participants)
    setreceiver(rec)
      sessionStorage.setItem(id,0)
    
   sessionStorage.setItem("receiver",rec)
    
  navigate("/chatinit")
}
  return (
    <div className="chatbox" onClick={enterchat}>
      
      <div className="participant-info">{receiver}</div>
      <img src={pfp} className='account-pp'/>
      <div>{newmsgs!=0?newmsgs:''}</div>
    </div>
  );
}

export default Chatbox;
