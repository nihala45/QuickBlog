import React from 'react'
import Navbar from '../../components/User/Navbar'
import Header from '../../components/User/Header'
import BlogList from '../../components/User/BlogList'
import Newsletter from '../../components/User/Newsletter'
import Footer from '../../components/User/Footer'
const Home = () => {
  return (
    <>
      <Navbar/>
      <Header/>
      <BlogList/>
      <Newsletter/>
      <Footer/>
    </>
  )
}

export default Home
