import  { useState } from 'react'
import "./Login.css"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { app } from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


function Login() {
    
    const navigate = useNavigate();
    const [errormsg,seterrormsg] = useState('')
    const [info, setInfo] = useState({
        email: "",
        password: ""
    })
    function handleChange(event) {
        const { name, value } = event.target;
        setInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }))
    }

    async function informbackend(){
        const email= info.email
        const response = await fetch('/api/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            body: JSON.stringify({email}),
          });
          const data =  await response.json()
          console.log(data)
          localStorage.setItem('username',data.username)
          localStorage.setItem('name',data.name)
          console.log("saved to cache: ",localStorage.getItem('username'),localStorage.getItem('name'))
          
        }
    
    
    async function handleSubmit(event) {
        event.preventDefault();
         
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, info.email, info.password);
            seterrormsg('')
            informbackend()
            navigate('/home');
            console.log(userCredential)
        } catch (error) {
            seterrormsg("invalid credentials")
            console.log('inv creds',error);
        }
    }

    return (
        <div className="login-container">
            <h2>
                Login
            </h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input onChange={handleChange} value={info.email} type="email" placeholder='youremail@...com' id="email" name="email" />
                <label htmlFor="password">password</label>
                <input onChange={handleChange} value={info.password} type="password" placeholder="**************" id="password" name="password" />
                <button type="submit">Log In</button>
            </form>
            <button className="register-btn" onClick={()=>navigate('/register')}>Don't have an account? Register here.</button>
        {errormsg && <p style={{ color:'red'}}>{errormsg}</p>}
        </div>
    )
}
export default Login;