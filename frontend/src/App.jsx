import React from "react";
import Navbar from "./components/User/Navbar";
import {Route, Routes} from 'react-router-dom'
import Blog from "./pages/User/Blog";
import Home from "./pages/User/Home";
import Register from "./pages/User/Register";
import OtpVerify from "./pages/User/OtpVerify";
import Login from "./pages/User/Login"
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
