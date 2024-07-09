import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from "../src/pages/Register"
import Login from "../src/pages/Login"
import Chat from "../src/pages/Chat"
import SetAvatar from './pages/SetAvatar'

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/setAvatar" element={<SetAvatar />} />
        </Routes>
    </BrowserRouter>
  )
}
