import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import React, { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { app } from "../../../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function ForgotPassword() {

    const navigate = useNavigate(); // Initialize navigate function
    const auth = getAuth(app); // Get the Auth instance

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        const auth = getAuth(app);

        const config = {
            url: 'https://wex-1.onrender.com', // Replace with your login route
            handleCodeInApp: true,
        };
        try {
            await sendPasswordResetEmail(auth, email, config);
            setEmail('');
            setLoading(false);
            toast.success('Check your email for password reset link', {
                position: "top-right"
            })

            sessionStorage.setItem('passwordResetSuccess', 'true');
            // navigate('/');
        } catch (error) {
            setLoading(false);
            toast.error(error.message);
            console.log('Error in forgot password:', error);
        }
    }
    return (
        <div>
            <ToastContainer position="top-right" autoClose={5000} />
            {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Forgot Password</h4>}
            <form onSubmit={handleSubmit}>
                <input type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Type your email"
                    autoFocus
                />
                <br />
                <button type="submit" className="btn btn-raised" disabled={!email || loading}>
                    Submit
                </button>
            </form>
        </div>
    )
}
export default ForgotPassword