import React from "react";
import Navbar from "./components/Navbar";
import {Route, Routes} from 'react-router-dom'
import Blog from "./pages/Blog";
import Home from "./pages/Home";
import Login from "./pages/Login"
import Register from "./pages/Register";
import OtpVerify from "./pages/OtpVerify";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/blog/:id" element={<Blog/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/Register" element={<Register/>}/>
        <Route path="/otp" element={<OtpVerify/>}/>



      </Routes>
    </div>
  );
}

export default App;
