import React, { useEffect, useState } from 'react';
import { axiosClient } from '../../api/axios';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateTask() {
  const [projects,setProjects] = useState([])
  const [users,setUsers] = useState([])
  const [formData,setFormData] = useState({
    name: '',
    project_id: '',
    description: '',
    due_date: '',
    status: '',
    priority: '', 
    assigned_user_id: '', 
    image_path: null, 
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
      const response = await axiosClient.post(`${import.meta.env.VITE_BACKEND_URL}api/tasks`, formData,{
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

  const fetchProjects = async()=>{
      try{
        const response = await axiosClient.get(`${import.meta.env.VITE_BACKEND_URL}api/projects`)
        if(response.status === 200){
          setProjects(response.data.data)
        }
      }
        catch(err){
            console.log(err)
        }
      
    }
    const fetchUsers = async()=>{
      try{
        const response = await axiosClient.get(`${import.meta.env.VITE_BACKEND_URL}api/users`)
        if(response.status === 200){
          setUsers(response.data.data)
        }
      }
        catch(err){
            console.error(err)
        }
      
    }

    useEffect(()=>{
      fetchProjects()
      fetchUsers()
  },[])
  return (
    <div className='min-h-screen flex-col flex items-center justify-center'>
      <h1 className='text-white  mb-4 font-bold text-3xl'>Add a Task</h1>
      <form onSubmit={handleSubmit} className='create-form flex flex-col bg-slate-700 p-5 gap-4 rounded-md w-6/12'>
      <label className='flex flex-col '>
          <p>Project</p>
          <select name='project_id' className='p-2 text-white' onChange={handleChange} required>
            <option selected disabled >Select Project</option>
            {projects?.data?.length>0 && projects.data.map(project=>(
              <option value={project.id}>{project.name}</option>
            ))}
          </select>
          {error.project && <span className='text-red-500'>{error.project}</span>}
        </label>
        <label className='flex flex-col '>
          <p>Task Title</p>
          <input type='text' name='name' className='p-2' placeholder='Title' onChange={handleChange}  />
          {error.name && <span className='text-red-500'>{error.name}</span>}
        </label>
        <label className='flex flex-col '>
          <p>Task Description</p>
          <textarea name='description' className='resize-none h-[100px] p-2' placeholder='Description' onChange={handleChange}></textarea>
          {error.description && <span className='text-red-500'>{error.description}</span>}
        </label>
        <label className='flex flex-col '>
          <p>Task Due Date</p>
          <input type='date' name='due_date' onChange={handleChange} />
          {error.due_date && <span className='text-red-500'>{error.due_date}</span>}
        </label>
        <label className='flex flex-col '>
          <p>Task Status</p>
          <select name='status' className='p-2 text-white' onChange={handleChange} >
            <option disabled selected>Task STATUS</option>
            <option value='pending'>Pending</option>
            <option value='in_progress'>In Progress</option>
            <option value='completed'>Completed</option>
          </select>
          {error.status && <span className='text-red-500'>{error.status}</span>}
        </label>
        <label className='flex flex-col '>
          <p>Task Priority</p>
          <select name='priority' className='p-2 text-white' onChange={handleChange} >
            <option disabled selected>Priority</option>
            <option value='low'>Low</option>
            <option value='medium'>Medium</option>
            <option value='high'>High</option>
          </select>
          {error.status && <span className='text-red-500'>{error.status}</span>}
        </label>
        <label className='flex flex-col '>
          <p>Assigned User</p>
          <select name='assigned_user_id' className='p-2 text-white' onChange={handleChange} required>
          <option selected disabled >Select User</option>
            {users?.data?.length>0 && users.data.map(user=>(
              <option value={user.id}>{user.name}</option>
            ))}
          </select>
        </label>
        <label className='flex flex-col '>
          <p>Task Image </p>
          <input type='file' name='image_path' onChange={handleChange} />
          {error.image_path && <span className='text-red-500'>{error.image_path}</span>}
        </label>
        <div className='flex items-center gap-4'>
        <button type='submit' className='bg-green-400 rounded-sm p-2 w-1/4  text-1xl'>{loading ? <AiOutlineLoading3Quarters className='animate-spin text-2xl text-center' /> : 'Submit'}</button>
        <Link to='/tasks' className='p-2 bg-gray-300 text-black rounded-sm'>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
