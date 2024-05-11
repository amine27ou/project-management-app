import React, { useEffect } from 'react'
import { FaLaravel } from "react-icons/fa";
import { Outlet, useNavigate} from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext';

export default function GuestLayout() {
  const {user,authenticated} = useAuthContext()
  const navigate = useNavigate()
  useEffect(() => {
    if (authenticated && user) {
      navigate('/')
    } else if (!authenticated && !user) {
      navigate('/login')
    }
  }, [authenticated, user])
  return (
    <div className='bg-slate-900 h-screen flex flex-col items-center justify-center'>
      <header>
        <div>
          <FaLaravel className='text-gray-500 text-7xl' />
        </div>
      </header>
       <main>
        <Outlet/>
       </main>
    </div>
  )
}
