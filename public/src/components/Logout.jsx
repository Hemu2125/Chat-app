import React from 'react';
import "../index.css";
import { useNavigate } from 'react-router-dom';
import { BiPowerOff } from "react-icons/bi";

export default function Logout() {
    const navigate = useNavigate();
    const handleClick = async ()=>{
        localStorage.clear();
        navigate("/login");
    }
  return (
    <div>
        <button className="logout" onClick={handleClick}>
            <BiPowerOff />
        </button>
    </div>
  )
}
