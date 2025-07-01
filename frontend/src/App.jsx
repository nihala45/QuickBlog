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
import ManageBlog from './pages/Admin/ManageBlog'
import Layout from './pages/Admin/Layout'
import ManageCategories from "./pages/Admin/ManageCategories";
import UserBlogPage from './pages/User/UserBlogPage'
import AddBlog from './pages/User/AddBlog'
import BlogDetailPage from './pages/User/BlogDetailPage'
import EditBlogPage from "./pages/User/EditBlogPage";
import UserManagement from "./pages/Admin/UserManagement";
import ForgetPassword from "./pages/User/ForgetPassword";
import VerifyForgotPasswordOtp from "./pages/User/VerifyForgotPasswordOtp";
import ResetPassword from "./pages/User/ResetPassword";
import UserDashboard from "./pages/User/UserDashboard";
import DraftViewPage from "./pages/Admin/DraftViewPage";
import ViewDraftBlog from "./pages/User/ViewDraftBlog";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/blog/:id" element={<Blog/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/Register" element={<Register/>}/>
        <Route path="/otp/:id" element={<OtpVerify />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/forget-otp/:id" element={<VerifyForgotPasswordOtp />} />
        <Route path="/reset-password/:id" element={<ResetPassword />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-draft" element={<ViewDraftBlog />} />

       

        




        
        <Route path="/admin/login" element={<AdminLogin />} />
       

        

        <Route path="/admin" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="manage-users" element={<UserManagement />} />
          <Route path="manage-categories" element={<ManageCategories/>} />
          <Route path="manage-blog" element={<ManageBlog/>} />
         <Route path="draft-blog" element={<DraftViewPage />} />
        </Route>
        
       <Route path="/user-blog-page" element={<UserBlogPage />} />
       <Route path="/add-blog" element={<AddBlog />} />

         <Route path="/blog-detail/:id" element={<BlogDetailPage />} />

        <Route path="/blog/edit/:id" element={<EditBlogPage />} />
      </Routes>
    </div>
  );
}

export default App;
