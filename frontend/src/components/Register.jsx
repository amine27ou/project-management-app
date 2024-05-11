import React,{useState} from 'react'
import { Link} from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export default function Register() {
  const {register,error} = useAuthContext()
  const [formData,setFormData] = useState({
    name:'',
    email:'',
    password:'',
    password_confirmation:''
  })

  const handleChange = (e)=>{
    e.preventDefault()
    setFormData(prevState=>({...prevState,[e.target.name]:e.target.value}))
  }
  const handleSubmit = (e)=>{
    e.preventDefault()
    register(formData)
  }
  return (
    <div className='my-5 bg-slate-800 p-5 rounded-md'>
      <form onSubmit={handleSubmit} className='w-80'>
        <label htmlFor='name'>
          <p className='text-gray-300'>Name</p>
          <input type='text'
          name='name'
          id='name'
          value={formData.name}
          className='bg-slate-900 p-2 rounded-sm border border-gray-600 w-80 text-gray-400 outline-none'
          onChange={handleChange}
          />
            {error.name && <p className='text-red-500'>{error.name}</p>}
        </label>
        <label htmlFor='email'>
          <p className='text-gray-300'>Email</p>
          <input type='text'
          name='email'
          id='email'
          value={formData.email}
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
          value={formData.password}
          className='bg-slate-900 p-2 rounded-sm border border-gray-600 w-80 text-gray-400 outline-none'
          onChange={handleChange}
          />
            {error.password && <p className='text-red-500'>{error.password}</p>}
        </label>
        <label htmlFor='password_confirmation'>
          <p className='text-gray-300'>Confirm Password</p>
          <input type='password'
          name='password_confirmation'
          id='password_confirmation'
          value={formData.password_confirmation}
          className='bg-slate-900 p-2 rounded-sm border border-gray-600 w-80 text-gray-400 outline-none'
          onChange={handleChange}
          />
        </label>
        <div className='my-4 flex items-center justify-end gap-5'>
          <Link to='/login' className='underline text-gray-300'>Already registered?</Link>
          <button type='submit' className='text-slate-900 bg-white p-2 rounded-md'>Register</button>
        </div>
      </form>
    </div>
  )
}
