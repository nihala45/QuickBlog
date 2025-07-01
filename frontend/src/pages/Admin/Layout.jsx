import React from 'react'
import Sidebar from '../../components/Admin/sidebar'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Admin/Navbar'
import Footer from '../../components/User/Footer' 

const Layout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar/>
      <div className='flex h-full'>
        <Sidebar/>
        <div className='flex-1 p-4 pt-10 md:px-10 h-full overflow-auto'>
          <Outlet/>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
