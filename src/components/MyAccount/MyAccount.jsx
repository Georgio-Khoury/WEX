// Account.js
import React, { useState } from 'react';
import "./MyAccount.css";
import Sidebar from '../NavBar/Sidebar';


const MyAccount = () => {
    return (
        <div className='page-container'>
        <Sidebar/>
            <div className='content'>
            <div className="account-section">
            {/* Content for My Account */}
            <h2>My Account</h2>
            <div className="account-details">
                <div className="profile-info">
                    <img src={sessionStorage.getItem("pfp")} alt="Profile" className="account-profile-pic" />
                    <h3>{sessionStorage.getItem("username")}</h3>
                    <p>{sessionStorage.getItem("email")}</p>
                    <p>{sessionStorage.getItem("pn")}</p>
                    {/* Other personal details */}
                </div>
            </div>
        </div>
              </div>
            </div>
        
    );
};

export default MyAccount;