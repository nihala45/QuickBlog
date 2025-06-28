import React from 'react'
import UserSidebar from '../../components/User/UserSidebar'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/User/Navbar'

const Layout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar/>
      <div className='flex h-full'>
        <UserSidebar/>
        <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
            <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Layout
