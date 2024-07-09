import React,{useState,useEffect} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import "../index.css";
import {toast,ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from '../utils/APIRoutes';

function Login() {
    const navigate = useNavigate();
    const [values,setValues] = useState({
        username:"",
        password:"",
    })
    const handleSubmit = async (event) =>{
        event.preventDefault()
        if(handleValidation()){
            const {username,password}=values;
            const {data} = await axios.post(loginRoute,{
                username,password,
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
    useEffect(()=>{
        const user = localStorage.getItem("chat-app-user");
        if(user){
            navigate("/");
        }}
    );
  
    const handleValidation=()=>{
        const {username,password}=values;
         if(username.length ===""){
            toast.error("Username is required",toastOptions);
            return false;
        }else if(password.length ===""){
          toast.error("Password is required",toastOptions);
          return false;
        }else if(password.length <8){
            toast.error("Password should not be less than 8 characters",toastOptions);
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
        <h1>Login</h1>
          
            <input 
              type="text" 
              placeholder="Username"
              name="username" 
              onChange={(e)=> handleChange(e)} 
              min="3" 
              />
            <input 
              type="password" 
              placeholder="Password"
              name="password" 
              onChange={(e)=> handleChange(e)}  
              />
            <button type="submit">Login</button>
            <span>Don't have an account? <Link to="/register">Register</Link></span>

        </form>
        </div>
        <ToastContainer />
    </>
  )
}

export default Login;