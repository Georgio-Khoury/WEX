import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Logout.css";
import Cookies from 'js-cookie'
const Logout = () => {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(true); // Set to true for demonstration

    const confirmLogout = () => {
        sessionStorage.clear();
        Cookies.remove('jwtToken')
        navigate('/');
    };

    if (showConfirm) {
        return (
            <div className="logout-modal">
                <div className="logout-modal-content">
                    <h2>Do you really want to log out?</h2>
                    <div className="logout-modal-actions">
                        <button onClick={confirmLogout}>Yes</button>
                        <button onClick={() => setShowConfirm(false)}>No</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="logout-section">
            <button onClick={() => setShowConfirm(true)}>Log Out</button>
        </div>
    );
};

export default Logout;