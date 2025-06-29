import React from 'react'
import UserBlogList from '../../components/User/UserBlogList'
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer'
const UserBlogPage = () => {
  return (
    <div>
      <Navbar/>
      <UserBlogList/>
      <Footer/>
    </div>
  )
}

export default UserBlogPage
