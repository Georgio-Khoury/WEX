import  { useState } from 'react'
import Spinner from '../../Spinner/Spinner';
import "./Login.css"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { app } from '../../../firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Cookies from 'js-cookie'
import { useLogin } from '../../hooks/useLogin';
function Login() {
    const {login} = useLogin()
    const [loading, setloading] = useState(false);
    const API = import.meta.env.VITE_REACT_API
    console.log(API)
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
         const response = await fetch(`${API}/login/${email}`,{
            method:'GET',
            
         })
          const data =  await response.json()
          console.log(data)
          sessionStorage.setItem('username',data.username)
          sessionStorage.setItem('name',data.name)
          sessionStorage.setItem("pfp", data.pfp)
          sessionStorage.setItem("pn",data.pn)
          sessionStorage.setItem("email",data.email)
          sessionStorage.setItem('categ','')
          sessionStorage.setItem('jwtToken',data.token)
          console.log("saved to session storage: ",sessionStorage.getItem('username'),sessionStorage.getItem('name'),sessionStorage.getItem('email'))
          
         login(data.username)
         
        }
    
    
    async function handleSubmit(event) {
        event.preventDefault();
         setloading(true)
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, info.email, info.password);
            seterrormsg('')
            await informbackend()
            setloading(false)
            navigate('/product');
            console.log(userCredential)
        } catch (error) {
            seterrormsg("invalid credentials")
            setloading(false)
            console.log('inv creds',error);
        }
       
    }

    return (
        <div className="login-container">
            <h2>
                {loading&&<Spinner/>}
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