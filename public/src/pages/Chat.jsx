import React,{useState,useEffect,useRef} from 'react';
import "../index.css";
import axios from "axios";
import { useNavigate} from 'react-router-dom';
import { host,allUsersRoute } from '../utils/APIRoutes';
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from '../components/ChatContainer.jsx';
import {io} from "socket.io-client";


function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts,setContacts] = useState([]);
  const [currentUser,setCurrentUser] = useState(undefined);
  const [currentChat,setCurrentChat] = useState(undefined);
  const [isLoaded,setIsLoaded] = useState(false);
  useEffect(()=>{
    if(!localStorage.getItem("chat-app-user")){
      navigate("/login");
    }else{
      setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
      setIsLoaded(true);
    }
  },[setCurrentUser,navigate]);
  useEffect(()=>{
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user",currentUser._id);
    }
  },[currentUser])
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImgSet) {
          try {
            const response = await axios.get(`${allUsersRoute}/${currentUser._id}`)
            console.log("called");
            setContacts(response.data);
          } catch (error) {
            console.error("Failed to fetch data:", error);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };
  
    fetchData();
  }, [currentUser, navigate, setContacts]);
  const handleChatChange = (chat)=>{
    setCurrentChat(chat)
  }
  return (
    <div className='chatContainer'>
      <div className='container'>
         <Contacts 
           contacts={contacts} 
           currentUser={currentUser} 
           changeChat={handleChatChange}
           />
           { isLoaded && currentChat === undefined ?(
            <Welcome currentUser={currentUser}/>
             ):(
                 <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
             )
           }
           
      </div>
      
    </div>
  )
}

export default Chat;