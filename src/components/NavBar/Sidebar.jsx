import React, { useState,useEffect, useRef } from 'react'
import './Sidebar.css'

import { Link, useNavigate } from 'react-router-dom';
import {onSnapshot,getFirestore,collection,query,where,getDocs} from 'firebase/firestore'
import Logout from '../Authentication/Logout';
function Sidebar() {
    const navigate = useNavigate()
    const [logout,setlogout] = useState(false)
    const [newMessage, setnewMessage] = useState(false);
    const [isScrolled, setIsScrolled] = useState();
    var first = true

    useEffect(() => {
        // Function to handle scroll event
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            // Check if the user has scrolled down enough to fix the navbar
            if (scrollTop > 1) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        }; // Add event listener when component mounts
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Empty dependency array means this effect runs only once after the component mounts

    setTimeout(() => {
        console.log('kholes')
        first=false
    },10000)
    useEffect(() => {
        const unsubscribe = listenForNewMessages();
        
        console.log('setup listener complet')
        // Set up listener on component mount
        return () => { 
            
            unsubscribe(); // Clean up listener on component unmount
        };
    }, []); // Run only once on component mount

    const listenForNewMessages =  () => {
        const db = getFirestore();
        const chatsRef = collection(db, 'Chats');
        const user = sessionStorage.getItem('username')
       
        const q = query(chatsRef, where('Participants', 'array-contains', user));
        
        
        return onSnapshot(q, (snapshot) => {
           
            snapshot.forEach((doc) => {
               const snapsize = snapshot.docChanges().length
             
                const messagesRef = collection(doc.ref, 'Messages');
                const messagesQuery = query(messagesRef);
            
                const unsubscribe = onSnapshot(messagesQuery, (messagesSnapshot) => {
                   
                 
                 
                    
                    messagesSnapshot.docChanges().forEach((change) => {
            
                        
                        if (change.type === 'added'&&first==false) {
                            console.log('new msg recieved')
                    
                            setnewMessage(true);

                        }
                        
                    });
                    
                    
                });
               
                
                
            });
        })
        
    }
    const logoutpop=()=>{
       
        setlogout(true)
      
    }

    return (
        <nav className={isScrolled ? 'navbar scrolled' : 'navbar'} >
            <div className="profile-circle">
                <img src={sessionStorage.getItem("pfp")} alt="Profile" />
            </div>
            <ul className="navbar-list">
                <li className="navbar-item"  onClick={()=>navigate('/product')}>
                    <Link to="/product">Buying</Link>
                </li>
                <li className="navbar-item" onClick={()=>navigate('/sellproduct')}>
                    <Link to="/sellproduct">Selling</Link>
                </li>
                <li className={`navbar-item ${newMessage ? 'new-message' : ''}`} onClick={()=>navigate('/inbox')}>
                    <Link to="/inbox">
                        Chat {newMessage && <span className="new-message-label">New</span>}
                    </Link>
                </li>
                <li className="navbar-item" onClick={()=>navigate('/myproducts')} >
                    <Link to="/myproducts">My Items</Link>
                </li>
                <li className="navbar-item" onClick={()=>navigate('/wishlist')}>
                    <Link to="/wishlist">WishList</Link>
                </li>
                <li className="navbar-item" onClick={()=>navigate('/myaccount')}>
                    <Link to="/myaccount">My Account</Link>
                </li>
                <li className="navbar-item" onClick={logoutpop} style={{ color: 'white' }}>
                    {logout?<Logout/>:'Logout'}
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;




