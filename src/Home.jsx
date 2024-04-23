import React, { useState } from 'react'
import "./Home.css";
import { useNavigate } from 'react-router-dom';

function Home() {

    const [selectedItem, setSelectedItem] = useState(null);

    function handleClick(item) {
        setSelectedItem(item);
    }

    return (
        <div>
            
            <Navbar onItemClick={handleClick} />
            {selectedItem === 'buying' && <BuyingItems />}
            {selectedItem === 'selling' && <SellingItems />}
            {selectedItem === 'account' && <MyAccount />}
            {selectedItem === 'logout' && <Logout />}
          
        </div>
    )
}
const Navbar = ({ onItemClick }) => {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item" onClick={() => onItemClick('buying')}>Buying</li>
                <li className="navbar-item" onClick={() => onItemClick('selling')}>Selling</li>
                <li className="navbar-item" onClick={() => onItemClick('account')}>My Account</li>
                <li className="navbar-item" onClick={() => onItemClick('logout')}>Log Out</li>
            </ul>
        </nav>
    );
};
const BuyingItems = () => {
    return (
        <div>
            {/* Content for Buying Items */}
            <h2>Buying Items</h2>
            <p>List of items available for purchase...</p>
        </div>
    );
};
const SellingItems = () => {
    return (
        <div>
            {/* Content for Selling Items */}
            <h2>Selling Items</h2>
            <p>List of items available for sale...</p>
        </div>
    );
};
const MyAccount = () => {
    return (
        <div>
            {/* Content for My Account */}
            <h2>My Account</h2>
            <p>User account information...</p>
        </div>
    );
};
const Logout = () => {
    return (
        <div>
            {/* Content for Logout */}
            <h2>Log Out</h2>
            <p>Logout functionality...</p>
        </div>
    );
};
export default Home