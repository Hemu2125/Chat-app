import React,{useState} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import "../index.css";
import {toast,ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';

function Register() {
    const navigate = useNavigate();
    const [values,setValues] = useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:""
    })
    const handleSubmit = async (event) =>{
        event.preventDefault()
        if(handleValidation()){
            const {username,email,password}=values;
            const {data} = await axios.post(registerRoute,{
                username,email,password,
            });
            if(data.status===false){
                toast.error(data.msg,toastOptions);
            }
            if(data.status===true){
                localStorage.setItem("chat-app-user",JSON.stringify(data.user));
                navigate("/");
            }
        }
    };
    const toastOptions ={
        position:"bottom-right",
        autoClose:8000,
        pauseOnHover:true,
        draggle: true,
        theme: "dark",
    }
    const handleValidation=()=>{
        const {username,email,password,confirmPassword}=values;
        if(password!==confirmPassword){
            toast.error("Passwords don't match",toastOptions);
        return false;
        }else if(username.length <3){
            toast.error("Username should be greater than 3 characters",toastOptions);
            return false;
        }else if(password.length <8){
            toast.error("Password should not be less than 8 characters",toastOptions);
            return false;
        }else if(email===""){
            toast.error("Email is required",toastOptions);
            return false;
        }
        return true;
    }
    const handleChange = (event) =>{
        setValues({
            ...values,
            [event.target.name]:event.target.value
        })
    };
  return (
    <>
      <div className="formContainer">
        <form  onSubmit={(event)=> handleSubmit(event)}>
        <h1>Register</h1>
          
            <input 
              type="text" 
              placeholder="Username"
              name="username" 
              onChange={(e)=> handleChange(e)}  
              />
         
          <input 
              type="email" 
              placeholder="Email"
              name="email" 
              onChange={(e)=> handleChange(e)}  
            />
            <input 
              type="password" 
              placeholder="Password"
              name="password" 
              onChange={(e)=> handleChange(e)}  
              />
              <input 
              type="password" 
              placeholder="Confirm Password"
              name="confirmPassword" 
              onChange={(e)=> handleChange(e)}  
              />
            
            <button type="submit">Register</button>
            <span>Already have an account? <Link to="/login">Login</Link></span>

        </form>
        </div>
        <ToastContainer />
    </>
  )
}

export default Register