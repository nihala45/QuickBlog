import React from 'react'
import {assets} from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
        <img onClick={()=>navigate('/')} src={assets.logo} alt="logo" className='2-32 sm:w-44' />
        <button onClick={()=>navigate('/login')}>
          Login
          <img src={assets.arrow} className='w-3' alt="arrow" />
        </button>
      </div>
    </div>
  )
}

export default Navbar
