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
import AddCategories from './pages/Admin/AddCategories'
import UserBlogPage from './pages/User/UserBlogPage'
import AddBlog from './pages/User/AddBlog'
import BlogDetailPage from './pages/User/BlogDetailPage'

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
          <Route path="list-categories" element={<AddCategories/>} />

        </Route>
        <Route path="userblogpage" element={< UserBlogPage/>} />
        <Route path="addBlog" element={<AddBlog />} />
        <Route path="/blogdetailpage/:id" element={<BlogDetailPage/>}/>


        

      </Routes>
    </div>
  );
}

export default App;
