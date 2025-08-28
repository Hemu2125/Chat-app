import React,{useState,useEffect,useRef} from 'react';
import axios from 'axios';
import "../index.css";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
// import Messages from "./Messages";
import {v4 as uuidv4} from "uuid";
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';

export default function ChatContainer({currentChat,currentUser,socket}) {
    const [messages,setMessages] = useState([]);
    const [arrivalMessage,setArrivalMessage] = useState(null);
    const scrollRef = useRef();
    useEffect(() => {
      const fetchData = async () => {
        if(currentChat) {
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });
          // if (response.data && Array.isArray(response.data)) {
          //   console.log('Fetched messages:', response.data);
          //   setMessages(response.data);
          // } else {
          //   console.error('Unexpected response format:', response.data);
          // }
        // } catch (error) {
        //   console.error("Failed to fetch messages:", error);
        // }
        setMessages(response.data);
      };
      }
      fetchData();
    
  }, [currentUser,currentChat]);
      
    
    const handleSendMsg = async(msg) =>{
      await axios.post(sendMessageRoute,{
        from:currentUser._id,
        to:currentChat._id,
        message:msg,
      });
      socket.current.emit("send-msg",{
        from:currentUser._id,
        to:currentChat._id,
        message:msg,
      });
      const msgs = [...messages];
      msgs.push({fromSelf:true, messages:msg});
      setMessages(msgs);
    };
    useEffect(()=>{
      if(socket.current){
        socket.current.on("msg-recieve",(msg)=>{
          setArrivalMessage({fromSelf:false,message:msg});
        });
      }
    },[socket]);

    useEffect(()=>{
      arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    },[arrivalMessage]);

    useEffect(()=>{
      scrollRef.current?.scrollIntoView({behaviour: "smooth"});
    },[messages]);

  return (
    <>
    {currentChat && 
    <div className='ChatContainer'>
        <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`${currentChat.avatarImg}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
        </div>
      <div className="chat-messages">  
      {
        messages.map((message, index) => (
          <div key={uuidv4()}>
            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content-msg">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))
      }
          <div ref={scrollRef} />
        </div>
        <ChatInput handleSendMsg={handleSendMsg}/>
        
    </div>
    }
    </>
  )
}
