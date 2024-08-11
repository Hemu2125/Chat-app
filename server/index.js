import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js";
import messageRoute from "./routes/messagesRoute.js";
import { createServer } from 'http';
// import socket from 'socket.io';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);
// app.use('/socket.io', require('socket.io')(httpServer));

mongoose.connect(process.env.MONGO_URI,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(()=>{
    console.log("Connected to MongoDB");
}).catch((e)=>{
    console.log(e.message);
})

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

// const io = socket(server,{
//     cors:{
//         origin:"http://localhost:3000",
//         credentials: true,
//     },
// });

global.onlineUsers = new Map();

io.on("connection",(socket)=>{
    global.chatSocket = socket;

    socket.on("add-user",(userId)=>{ 
        onlineUsers.set(userId,socket.id);  
    });

    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.message);
        }
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        // Optionally handle user disconnection
      });
});
