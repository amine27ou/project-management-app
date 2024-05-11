import React, { useState } from 'react';
import { axiosClient } from '../../api/axios';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateProject() {
  const [formData,setFormData] = useState({
    name: '',
    description: '',
    due_date: '',
    status: '',
    image: null, 
  });  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { type, name, files, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosClient.post(`${import.meta.env.VITE_BACKEND_URL}api/projects`, formData,{
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      if (response.status === 200) {
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setLoading(false);
        setError(err.response.data.errors);
      }
    }
  };
  return (
    <div className='min-h-screen flex-col flex items-center justify-center'>
      <h1 className='text-white  mb-4 font-bold text-3xl'>Add a Project</h1>
      <form onSubmit={handleSubmit} className='create-form flex flex-col bg-slate-700 p-5 gap-4 rounded-md w-6/12'>
        <label className='flex flex-col '>
          <p>Project Title</p>
          <input type='text' name='name' className='p-2' placeholder='Title' onChange={handleChange}  />
          {error.name && <span className='text-red-500'>{error.name}</span>}
        </label>
        <label className='flex flex-col '>
          <p>Project Description</p>
          <textarea name='description' className='resize-none h-[100px] p-2' placeholder='Description' onChange={handleChange}></textarea>
          {error.description && <span className='text-red-500'>{error.description}</span>}
        </label>
        <label className='flex flex-col '>
          <p>Project Due Date</p>
          <input type='date' name='due_date' onChange={handleChange} />
          {error.due_date && <span className='text-red-500'>{error.due_date}</span>}
        </label>
        <label className='flex flex-col '>
          <p>Project Status</p>
          <select name='status' className='p-2 text-white' onChange={handleChange} >
            <option disabled selected>PROJECT STATUS</option>
            <option value='pending'>Pending</option>
            <option value='in_progress'>In Progress</option>
            <option value='completed'>Completed</option>
          </select>
          {error.status && <span className='text-red-500'>{error.status}</span>}
        </label>
        <label className='flex flex-col '>
          <p>Project Image </p>
          <input type='file' name='image_path' onChange={handleChange} />
          {error.image_path && <span className='text-red-500'>{error.image_path}</span>}
        </label>
        <div className='flex items-center gap-4'>
        <button type='submit' className='bg-green-400 rounded-sm p-2 w-1/4  text-1xl'>{loading ? <AiOutlineLoading3Quarters className='animate-spin text-2xl text-center' /> : 'Submit'}</button>
        <Link to='/projects' className='p-2 bg-gray-300 text-black rounded-sm'>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
