import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { axiosClient } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function Profile() {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    }
  }, [user]);

  const navigate = useNavigate()

  const handleSave = async(e) => {
    e.preventDefault();
    setLoading(true)

    if (formData.new_password !== formData.confirm_password) {
        setErrors({ confirm_password: ['Passwords do not match'] });
        setLoading(false)
        return;
    }
      

    const passwordsFormData = {
        _method:'PATCH',
       ...formData
    }
    try{
        setLoading(true)
        const response = await axiosClient.patch(`${import.meta.env.VITE_BACKEND_URL}api/profile`,passwordsFormData)
        if(response.status === 200){
            setLoading(false)
            navigate('/profile')
            setErrors({})
        }
    }
    catch(err){
        if(err.response.data.errors){
            setLoading(false)
            setErrors(err.response.data.errors)
        }
    }
  };

  const deleteAcc = async(e)=>{
    e.preventDefault()

    try{
        const response = await axiosClient.delete(`${import.meta.env.VITE_BACKEND_URL}api/profile`,{
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                password: formData.current_password
            }
        })
        if(response.status === 200){
            navigate('/login')
            setErrors({})
        }
    }
    catch(err){
        if(err.response.data.errors){
            setErrors(err.response.data.errors)
        }
    }
  }
  console.log(formData)
  return (
    <div>
      <header className="bg-gray-800 shadow mb-4 rounded-md">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Profile</h1>
        </div>
      </header>
      <div className="bg-gray-800 shadow mb-4 rounded-md mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h3 className="text-2xl text-white">Profile information</h3>
        <p className="text-1xl text-gray-500">Update your account's profile information and email address</p>
        <form onSubmit={handleSave} className="flex flex-col">
          <label>
            <p className="text-white">Name</p>
            <input
              type="text"
              className="bg-slate-900 p-2 rounded-sm border border-gray-600 w-80 text-gray-400 outline-none"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          {errors.name && <p className="text-red-500">{errors.name}</p>}
          <label>
            <p className="text-white">Email</p>
            <input
              type="email"
              className="bg-slate-900 p-2 rounded-sm border border-gray-600 w-80 text-gray-400 outline-none"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          
          <label>
            <p className="text-white">Current Password</p>
            <input
              type="password"
              className="bg-slate-900 p-2 rounded-sm border border-gray-600 w-80 text-gray-400 outline-none"
              name="current_password"
              onChange={handleChange}
            />
          </label>
          {errors.current_password && <p className="text-red-500">{errors.current_password}</p>}
          {errors.password && <p className="text-red-500">{errors.password[0]}</p>}
          <label>
            <p className="text-white">New Password</p>
            <input
              type="password"
              className="bg-slate-900 p-2 rounded-sm border border-gray-600 w-80 text-gray-400 outline-none"
              name="new_password"
              onChange={handleChange}
            />
          </label>
          {errors.new_password && <p className="text-red-500">{errors.new_password[0]}</p>}
          <label>
            <p className="text-white">Confirm New Password</p>
            <input
              type="password"
              className="bg-slate-900 p-2 rounded-sm border border-gray-600 w-80 text-gray-400 outline-none"
              name="confirm_password"
              onChange={handleChange}
            />
          </label>
          {errors.confirm_password && <p className="text-red-500">{errors.confirm_password}</p>}
          <button type="submit" className="bg-white p-2 w-20 rounded-md mt-5 text-slate-900">
            {loading ?  <AiOutlineLoading3Quarters  className='text-black animate-spin text-center' /> :'Save'}
          </button>
        </form>
      </div>
      <div className="bg-gray-800 shadow mb-4 rounded-md mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h3 className="text-2xl text-white">Delete Account</h3>
        <p className="mb-4 text-1xl text-gray-500">Once your account is deleted, all of its ressources and data will be permanently deleted.
            Before deleting your account, please download any data or information that you wish to retain.
        </p>
        <button onClick={deleteAcc} className='bg-red-500 text-white p-2 rounded-md'>DELETE ACCOUNT</button>
      </div>
    </div>
  );
}
