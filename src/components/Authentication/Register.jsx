import React, { useState } from 'react';
import "./Register.css";
import Spinner from '../../Spinner/Spinner';
import { useNavigate } from 'react-router-dom';
import { app } from '../../../firebaseConfig';
import {getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

function Register() {
    const API = import.meta.env.VITE_REACT_API
    const initialFormData = {
        name: "",
        pfp:null,
        pn:+961,
        username:"",
        email: "",
        password: "",
        confirmPassword: ""
    }
    const navigate = useNavigate();
    const [info, setInfo] = useState(initialFormData)
    const[errormsg,seterrormsg] = useState('')
    const [loading, setloading] = useState(false);
    function handleChange(event) {
        const { name, value } = event.target;
        const newValue = name === 'pfp' ? event.target.files[0] : value;
        
        setInfo(prevInfo => ({
            ...prevInfo,
            [name]: newValue
        }))
        
    }
    

    async function handleSubmit(event) {
        event.preventDefault()
        setloading(true)
        const { password, confirmPassword } = info;
        if (password !== confirmPassword) {
            //alert("Passwords do not match. Please try again.")
            seterrormsg("Passwords don't match")
            setloading(false)
            return;
        }  
       
        console.log(info)
        var email = info.email
        var name = info.name
        var username = info.username
        var pn = info.pn
        var file = info.pfp
        var formdata  = new FormData()
        formdata.append('username',username)
        formdata.append('name',name)
        formdata.append('email',email)
        formdata.append('pn',pn)
        formdata.append('image',file)
       
        try{
        const response = await fetch(`${API}/adduser`,{
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
            },
            body: formdata
        })
        const data = await response.json()
        
        if(!response.ok){
           
            seterrormsg(data.error)
            setloading(false)
            return;
        }
    }catch(error){
        setloading(false)
        console.log(error)
        return;
    }
    console.log('meshe l7al')
    const auth =  getAuth()
    try{
    const reg = await createUserWithEmailAndPassword(auth,info.email,info.password)
        setloading(false)
        navigate('/')
    }catch(error){
        setloading(false)
        seterrormsg(error)
        return;
    }
    }

    return (
        <div className="register-container">
            <h2>Register</h2>
            {loading && <Spinner />}
            <form onSubmit={handleSubmit}>
                <label htmlFor="pfp">Profile Picture</label>
                <input onChange={handleChange}  type="file" accept="image/*" placeholder='profile pic' id="pfp" name="pfp" />

                <label htmlFor="name">Full name</label>
                <input onChange={handleChange} required value={info.name} type="text" placeholder='full name' id="name" name="name" />
               
                <label htmlFor="phone number">Phone Number</label>
                <input onChange={handleChange} required value={info.pn} type="text" placeholder='phone number' id="phone number" name="pn" />
               
                <label htmlFor="username">Username</label>
                <input onChange={handleChange} required value={info.username} type="text" placeholder='username' id="username" name="username" />
                
                <label htmlFor="email">Email</label>
                <input onChange={handleChange} required value={info.email} type="email" placeholder='youremail@...com' id="email" name="email" />
                
                <label htmlFor="password">Password</label>
                <input onChange={handleChange} required value={info.password} type="password" placeholder="**************" id="password" name="password" />
                
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input onChange={handleChange} required value={info.confirmPassword} type="password" placeholder="**************" id="confirmPassword" name="confirmPassword" />
                
                <button type="submit" className="register-btn">Register</button>
                <button className="login-btn" onClick={() => navigate('/')}>Already have an account? Login here.</button>
            </form>
            {errormsg &&<p className='error-msg'>{errormsg}</p>}
        </div>
    )
}
export default Register;