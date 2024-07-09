import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js";


const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("Connected to MongoDB");
}).catch((e)=>{
    console.log(e.message);
})
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})