import  { useState } from 'react'
import "./Login.css"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { app } from '../../../firebaseConfig';
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
         const response = await fetch(`/api/login/${email}`)
          const data =  await response.json()
          console.log(data)
          sessionStorage.setItem('username',data.username)
          sessionStorage.setItem('name',data.name)
          sessionStorage.setItem("pfp", data.pfp)
          sessionStorage.setItem("pn",data.pn)
          sessionStorage.setItem("email",data.email)
          console.log("saved to session storage: ",sessionStorage.getItem('username'),sessionStorage.getItem('name'),sessionStorage.getItem('email'))
          
        }
    
    
    async function handleSubmit(event) {
        event.preventDefault();
         
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, info.email, info.password);
            seterrormsg('')
            await informbackend()
            navigate('/product');
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
        <Link to="/forgotpassword" className="forgotPass">
                Forgot Password
            </Link>
        </div>
    )
}
export default Login;