import React, { useState,useEffect, useRef } from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom';
import {onSnapshot,getFirestore,collection,query,where,getDocs} from 'firebase/firestore'
import Logout from '../Authentication/Logout';
function Sidebar() {
    const [logout,setlogout] = useState(false)
    const [newMessage, setnewMessage] = useState(false);
    const first = useRef(true)
    
    useEffect(() => {
        const unsubscribe = listenForNewMessages(); // Set up listener on component mount
        return () => { 
            
            unsubscribe(); // Clean up listener on component unmount
        };
    }, []); // Run only once on component mount

    const listenForNewMessages =  () => {
        const db = getFirestore();
        const chatsRef = collection(db, 'Chats');
        const user = sessionStorage.getItem('username')
        console.log(user)
        const q = query(chatsRef, where('Participants', 'array-contains', user));
        
        console.log("querry set")
        return onSnapshot(q, (snapshot) => {
            
            snapshot.forEach((doc) => {
                console.log('ahell')
                const messagesRef = collection(doc.ref, 'Messages');
                const messagesQuery = query(messagesRef);
                console.log('honee')
                const unsubscribe = onSnapshot(messagesQuery, (messagesSnapshot) => {
                    
                   console.log(first)
                    
                    messagesSnapshot.docChanges().forEach((change) => {
                        if (change.type === 'added'&&!first.current) {
                            console.log('new msg recieved')
                            
                            setnewMessage(true);

                        }
                        
                    });
                    first.current=false
                });
            });
        })
    }
    const logoutpop=()=>{
        console.log('clicked')
        setlogout(true)
        console.log(logout)
    }

    return (
        <nav className="navbar">
            <div className="profile-circle">
                <img src={sessionStorage.getItem("pfp")} alt="Profile" />
            </div>
            <ul className="navbar-list">
                <li className="navbar-item">
                    <Link to="/product">Buying</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/sellproduct">Selling</Link>
                </li>
                <li className={`navbar-item ${newMessage ? 'new-message' : ''}`}>
                    <Link to="/inbox">
                        Chat {console.log(newMessage)}{newMessage && <span className="new-message-label">New</span>}
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link to="/myaccount">My Account</Link>
                </li>
                <li className="navbar-item" onClick={logoutpop}>
                    {logout?<Logout/>:'Logout'}
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;




