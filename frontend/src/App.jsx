import React from "react";
import { Routes, Route } from "react-router-dom";



// Unprotected pages
import Home from "./pages/User/Home"
import Login from "./pages/User/Login"
import Register from "./pages/User/Register"
import OtpVerify from "./pages/User/OtpVerify";
import ForgetPassword from "./pages/User/ForgetPassword";
import VerifyForgotPasswordOtp from "./pages/User/VerifyForgotPasswordOtp";
import ResetPassword from "./pages/User/ResetPassword";
import UserBlogPage from './pages/User/UserBlogPage';
import BlogDetailPage from "./pages/User/BlogDetailPage"


// Blog pages
import AddBlog from "./pages/User/AddBlog"
import EditBlogPage from "./pages/User/EditBlogPage"
import UserDashboard from "./pages/User/UserDashboard";


// Admin pages
import AdminLogin from "./pages/Admin/AdminLogin";
import Layout from "./pages/Admin/Layout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import ManageCategories from "./pages/Admin/ManageCategories";
import ManageBlog from "./pages/Admin/ManageBlog";
import DraftViewPage from "./pages/Admin/DraftViewPage";
import AdminBlogDetail from "./pages/Admin/AdminBlogDetail"
import AdminEditBlog from "./pages/Admin/AdminEditBlog";
import AdminAddBlog from "./pages/Admin/AdminAddBlog";


// Guards
import UserProtectedRoute from "./routes/UserProtectedRoute";
import UserLoginRedirect from "./routes/UserLoginRedirect";
import AdminLoginRedirect from "./routes/AdminLoginRedirect";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";




const App = () => {
  return (
    <Routes>

      
      <Route path="/" element={<Home />} />
     

      
      <Route
        path="/login"
        element={
          <UserLoginRedirect>
            <Login />
          </UserLoginRedirect>
        }
      />

      <Route
        path="/register"
        element={
          <UserLoginRedirect>
            <Register />
          </UserLoginRedirect>
        }
      />

      <Route path="/otp/:id" element={<OtpVerify />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/forget-otp/:id" element={<VerifyForgotPasswordOtp />} />
      <Route path="/reset-password/:id" element={<ResetPassword />} />

      {/* ✅ User protected routes */}
      <Route
        path="/user-dashboard"
        element={
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        }
      />

      

      <Route
        path="/user-blog-page"
        element={
          <UserProtectedRoute>
            <UserBlogPage />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/admin/add-blog"
        element={
          <UserProtectedRoute>
            <AddBlog />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/admin/blog-detail/:id"
        element={
          <UserProtectedRoute>
            <BlogDetailPage />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/admin/blog-edit/:id"
        element={
          <UserProtectedRoute>
            <EditBlogPage />
          </UserProtectedRoute>
        }
      />


     
      <Route
        path="/admin/login"
        element={
          <AdminLoginRedirect>
            <AdminLogin />
          </AdminLoginRedirect>
        }
      />


    <Route
        path="/admin/add-detail/:id"
        element={
          <AdminProtectedRoute>
            <AdminBlogDetail />
          </AdminProtectedRoute>
        }
      />



      <Route
        path="/admin/add-blog"
        element={
          <AdminProtectedRoute>
            <AdminAddBlog />
          </AdminProtectedRoute>
        }
      />

       <Route
        path="/admin/edit-blog/:id"
        element={
          <AdminProtectedRoute>
            <AdminEditBlog />
          </AdminProtectedRoute>
        }
      />

      

     
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <Layout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="manage-users" element={<UserManagement />} />
        <Route path="manage-categories" element={<ManageCategories />} />
        <Route path="manage-blog" element={<ManageBlog />} />
        <Route path="draft-blog" element={<DraftViewPage />} />
      </Route>
    </Routes>
  );
};

export default App;