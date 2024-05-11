import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Login() {
  const {btnLoading,error,login} = useAuthContext()
  const [formData,setFormData] = useState({
    email:'',
    password:''
  })
  
  const handleChange = (e)=>{
    e.preventDefault()
    setFormData(prevState=>({...prevState,[e.target.name]:e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData)
    setFormData({})
  };
  
  return (
    <div className='my-5 bg-slate-800 p-5 rounded-md'>
      <form onSubmit={handleSubmit} className='w-80'>
      
        <label htmlFor='email'>
          <p className='text-gray-300'>Email</p>
          <input type='text'
          name='email'
          id='email'
          className='bg-slate-900 p-2 rounded-sm border border-gray-600 w-80 text-gray-400 outline-none'
          onChange={handleChange}
          />
          {error.email && <p className='text-red-500'>{error.email}</p>}
        </label>
        <label htmlFor='password'>
          <p className='text-gray-300'>Password</p>
          <input type='password'
          name='password'
          id='password'
          className='bg-slate-900 p-2 rounded-sm border border-gray-600 w-80 text-gray-400 outline-none'
          onChange={handleChange}
          />
          {error.password && <p className='text-red-500'>{error.password[0]}</p>}
        </label>
        <label className='flex items-center justify-start gap-3' htmlFor='rememberMe '>
          <p className='text-gray-300'>Remember Me</p>
          <input type='checkbox'
          name='rememberMe'
          id='rememberMe'
          className='bg-slate-900 rounded-sm border border-gray-600 text-gray-400 outline-none'
          />
        </label>
        
        <div className='my-4 flex items-center justify-end gap-5'>
          <Link to='/login' className='underline text-gray-300'>Forgot your password</Link>
          <button type='submit' className='text-slate-900 bg-white p-2 rounded-md'>{btnLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> :'Login'}</button>
        </div>
      </form>
    </div>
  )
}
