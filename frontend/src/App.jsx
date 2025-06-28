import React from "react";
import Navbar from "./components/User/Navbar";
import {Route, Routes} from 'react-router-dom'
import Blog from "./pages/User/Blog";
import Home from "./pages/User/Home";
import Register from "./pages/User/Register";
import OtpVerify from "./pages/User/OtpVerify";
import Login from "./pages/User/Login"
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ListUsers from "./pages/Admin/ListUsers"
import Layout from './pages/Admin/Layout'
import UserLayout from './pages/User/UserLayout'
import UserDashboard from "./pages/User/UserDashboard";
import AddBlog from "./pages/User/AddBlog";
import ListBlog from "./pages/User/ListBlog";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/blog/:id" element={<Blog/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/Register" element={<Register/>}/>
        <Route path="/otp/:id" element={<OtpVerify />} />
        
        <Route path="/adminlogin" element={<AdminLogin/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>

        <Route path="/admin" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="list-users" element={<ListUsers />} />
        </Route>

        <Route path="/userdashboard" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="list-blog" element={<ListBlog />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;
