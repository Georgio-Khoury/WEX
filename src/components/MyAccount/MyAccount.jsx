// Account.js
import React, { useState } from 'react';
import "./MyAccount.css";
import Sidebar from '../NavBar/Sidebar';


const MyAccount = () => {
    const API = import.meta.env.VITE_REACT_API
    const [editMode,seteditmode] = useState(false)
    const [editItem, seteditItem] = useState({
        name:sessionStorage.getItem("name"),
        pn:sessionStorage.getItem('pn')
    });
    function handleChange(e){
        const { name, value } = e.target;
    seteditItem(prevItem => ({
      ...prevItem,
      [name]: value
    }));
    }
    async function handleSubmit(){
        var name = editItem.name
        var pn = editItem.pn
        const response = await fetch(`${API}/edituser`,
            {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify content type as JSON
                    'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
                  },
                  body: JSON.stringify({name,pn})
            }
           
        )
        const data = await response.json()
        seteditmode(false)
    }
    return (
        <div className='page-container'>
        <Sidebar/>
            <div className='content'>
            <div className="account-section">
            {/* Content for My Account */}
            <h2>My Account</h2>
            <div className="account-details">
               
                    {editMode?(
                        <div className='edit-profile'>
                    <div className="form-group">
                   <label htmlFor="name">Name:</label>
                   <input type="text" id="name" name="name" value={editItem.name} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                   <label htmlFor="pn">pn:</label>
                   <textarea id="pn" name="pn" value={editItem.pn} onChange={handleChange} />
                 </div>
                 
                <div>
                  <button onClick={()=>seteditmode(false)}>Cancel Edit</button>
                  </div>

                        </div>
                    ):(
                        <div className="profile-info">
                        <img src={sessionStorage.getItem("pfp")} alt="Profile" className="account-profile-pic" />
                        <h4>{editItem.name}</h4>
                        <h3>{sessionStorage.getItem("username")}</h3>
                        <p>{sessionStorage.getItem("email")}</p>
                        <p>{editItem.pn}</p>
                        </div>
                    )}
                    <button onClick={editMode ? handleSubmit : ()=>seteditmode(true)}>{editMode ? "Submit Changes" : "Edit"}</button>
                  
                
            </div>
        </div>
              </div>
            </div>
        
    );
};

export default MyAccount;