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
    

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            if (scrollTop > 1) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        }; 
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); 

    
    useEffect(() => {
        const unsubscribe = listenForNewMessages();
        
        console.log('setup listener complet')
        // Set up listener on component mount
        return () => { 
            
            unsubscribe(); // Clean up listener on component unmount
        };
    }, []); // Run only once on component mount

    const listenForNewMessages =  () => {
        console.log('listener has been setup')
        const db = getFirestore();
        const chatsRef = collection(db, 'Chats');
        const user = sessionStorage.getItem('username')
       
        const q = query(chatsRef, where('Participants', 'array-contains', user));
        
        
        return onSnapshot(q, (snapshot) => {
           
            snapshot.forEach((doc) => {
               
                
                const messagesRef = collection(doc.ref, 'Messages');
                const messagesQuery = query(messagesRef);
            
                const unsubscribe = onSnapshot(messagesQuery, (messagesSnapshot) => {
                   
                 
                 
                    
                    messagesSnapshot.docChanges().forEach((change) => {
                            console.log(change.doc.data())
                        //console.log(change.doc.data().timestamp.seconds>sessionStorage.getItem('logintime'))
                        
                        if (change.type === 'added'&&change.doc.data().sender!=sessionStorage.getItem('username')&&change.doc.data().timestamp.seconds>sessionStorage.getItem('logintime')) {
                            console.log('new msg recieved')
                            console.log(sessionStorage.getItem(doc.id))
                           
                            let c =parseInt(sessionStorage.getItem(doc.id))
                            const exists = c !== null && !isNaN(parseInt(c, 10));
                            exists?c++:c=1
                            console.log("c: ",c)
                            sessionStorage.setItem(doc.id,c)
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




