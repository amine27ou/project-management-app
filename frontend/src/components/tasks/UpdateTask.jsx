import React, { useEffect, useState } from 'react';
import { axiosClient } from '../../api/axios';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Loading from "../Loading";

export default function UpdateTask() {
    const { id } = useParams();
    const [projects,setProjects] = useState([])
    const [users,setUsers] = useState([])
    const [taskData, setTaskData] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        project_id: '',
        description: '',
        due_date: '',
        status: '',
        priority: '',
        assigned_user_id: '',
        image_path: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const fetchTask = async (taskId) => {
        try {
            const response = await axiosClient.get(`${import.meta.env.VITE_BACKEND_URL}api/tasks/${taskId}`);
            console.log(response.data.task);
            if (response.status === 200) {
                setTaskData(response.data.task);
            }
        } catch (err) {
            console.error(err);
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
  
      
    useEffect(() => {
        fetchTask(id);
        fetchProjects()
        fetchUsers()
    }, [id]);

    useEffect(() => {
        setFormData({
            name: taskData.name || '',
            project_id: taskData.project_id || '',
            description: taskData.description || '',
            due_date: taskData.due_date || '',
            status: taskData.status || '',
            priority: taskData.priority || '',
            assigned_user_id: taskData.assigned_user_id || '',
            image_path: null,
        });
    }, [taskData]);

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
            const formDataToSend = new FormData();
            formDataToSend.append('_method', 'PATCH');
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('project_id', formData.project_id);
            formDataToSend.append('due_date', formData.due_date);
            formDataToSend.append('status', formData.status);
            formDataToSend.append('priority', formData.priority);
            formDataToSend.append('assigned_user_id', formData.assigned_user_id);
            if (formData.image_path) {
                formDataToSend.append('image_path', formData.image_path);
            }
            const response = await axiosClient.post(`${import.meta.env.VITE_BACKEND_URL}api/tasks/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                setError({});
                alert('Task updated successfully!');
                navigate('/tasks');
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setLoading(false);
                setError(err.response.data.errors);
            }
        }
    };

    console.log(formData)

    return (
        <div className='min-h-screen flex-col flex items-center justify-center'>
            <h1 className='text-white mb-4 font-bold text-3xl'>Edit a Task</h1>
            {Object.values(taskData).length > 0 ? (
                <form onSubmit={handleSubmit} className='create-form flex flex-col bg-slate-700 p-5 gap-4 rounded-md w-6/12'>
                    <label className='flex flex-col '>
                        <p>Project</p>
                        <select name='project_id' className='p-2 text-white' onChange={handleChange} value={formData.project_id} required>
                            <option selected disabled>Select Project</option>
                            {projects?.data?.length > 0 && projects.data.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                        {error.project && <span className='text-red-500'>{error.project}</span>}
                    </label>
                    <label className='flex flex-col '>
                        <p>Task Title</p>
                        <input type='text' name='name' className='p-2' placeholder='Title' onChange={handleChange} value={formData.name} />
                        {error.name && <span className='text-red-500'>{error.name}</span>}
                    </label>
                    <label className='flex flex-col '>
                        <p>Task Description</p>
                        <textarea name='description' className='resize-none h-[100px] p-2' placeholder='Description' onChange={handleChange} value={formData.description}></textarea>
                        {error.description && <span className='text-red-500'>{error.description}</span>}
                    </label>
                    <label className='flex flex-col '>
                        <p>Task Due Date</p>
                        <input type='date' name='due_date' onChange={handleChange} value={formData.due_date} />
                        {error.due_date && <span className='text-red-500'>{error.due_date}</span>}
                    </label>
                    <label className='flex flex-col '>
                        <p>Task Status</p>
                        <select name='status' className='p-2 text-white' onChange={handleChange} value={formData.status}>
                            <option disabled>Select Status</option>
                            <option value='pending'>Pending</option>
                            <option value='in_progress'>In Progress</option>
                            <option value='completed'>Completed</option>
                        </select>
                        {error.status && <span className='text-red-500'>{error.status}</span>}
                    </label>
                    <label className='flex flex-col '>
                        <p>Task Priority</p>
                        <select name='priority' className='p-2 text-white' onChange={handleChange} value={formData.priority}>
                            <option disabled>Select Priority</option>
                            <option value='low'>Low</option>
                            <option value='medium'>Medium</option>
                            <option value='high'>High</option>
                        </select>
                        {error.priority && <span className='text-red-500'>{error.priority}</span>}
                    </label>
                    <label className='flex flex-col '>
                        <p>Assigned User</p>
                        <select name='assigned_user_id' className='p-2 text-white' onChange={handleChange} value={formData.assigned_user_id} required>
                            <option selected disabled>Select User</option>
                            {users?.data?.length > 0 && users.data.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                        {error.assigned_user_id && <span className='text-red-500'>{error.assigned_user_id}</span>}
                    </label>
                    <label className='flex flex-col '>
                        <p>Task Image</p>
                        <input type='file' name='image_path' onChange={handleChange} />
                        {error.image_path && <span className='text-red-500'>{error.image_path}</span>}
                    </label>
                    <div className='flex items-center gap-4'>
                        <button type='submit' className='bg-green-400 rounded-sm p-2 w-1/4 text-1xl'>{loading ? <AiOutlineLoading3Quarters className='animate-spin text-2xl text-center' /> : 'Submit'}</button>
                        <Link to='/tasks' className='p-2 bg-gray-300 text-black rounded-sm'>Cancel</Link>
                    </div>
                </form>
            ) : <Loading />}
        </div>
    );
}
