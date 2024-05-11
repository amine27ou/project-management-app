import React, { useEffect, useState } from 'react';
import { axiosClient } from '../../api/axios';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate, useParams ,Link} from 'react-router-dom';
import Loading from "../Loading"

export default function UpdateProject() {
    const { id } = useParams();
    const [projectData, setProjectData] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        due_date: '',
        status: '',
        image_path: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const fetchProject = async (projectId) => {
        try {
            const response = await axiosClient.get(`${import.meta.env.VITE_BACKEND_URL}api/projects/${projectId}`);
            if (response.status === 200) {
                setProjectData(response.data.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProject(id);
    }, [id]);

    useEffect(() => {
        setFormData({
            name: projectData.name || '',
            description: projectData.description || '',
            due_date: projectData.due_date ? projectData.due_date.split(' ')[0] : '', 
            status: projectData.status || '',
            image_path: null,
        });
    }, [projectData]);

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
            formDataToSend.append('_method','PATCH' );
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('due_date', formData.due_date);
            formDataToSend.append('status', formData.status);
            if (formData.image_path) {
                formDataToSend.append('image_path', formData.image_path);
            }            
            const response = await axiosClient.post(`${import.meta.env.VITE_BACKEND_URL}api/projects/${id}`, formDataToSend,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                setError({});
                alert('Project updated successfully!');
                navigate('/projects');
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
            <h1 className='text-white mb-4 font-bold text-3xl'>Edit a Project</h1>
            {Object.values(projectData).length > 0 ? <form onSubmit={handleSubmit} className='create-form flex flex-col bg-slate-700 p-5 gap-4 rounded-md w-6/12'>
                <label className='flex flex-col '>
                    <p>Project Title</p>
                    <input type='text' name='name' className='p-2' placeholder='Title' value={formData.name} onChange={handleChange} />
                    {error.name && <span className='text-red-500'>{error.name}</span>}
                </label>
                <label className='flex flex-col '>
                    <p>Project Description</p>
                    <textarea name='description' value={formData.description} className='resize-none h-[100px] p-2' placeholder='Description' onChange={handleChange}></textarea>
                    {error.description && <span className='text-red-500'>{error.description}</span>}
                </label>
                <label className='flex flex-col '>
                    <p>Project Due Date</p>
                    <input type='date' name='due_date' value={formData.due_date} onChange={handleChange} />
                    {error.due_date && <span className='text-red-500'>{error.due_date}</span>}
                </label>
                <label className='flex flex-col '>
                    <p>Project Status</p>
                    <select name='status' value={formData.status} className='p-2 text-white' onChange={handleChange}>
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
                <div className='flex gap-4'>
                <button type='submit' className={`bg-green-400 rounded-sm p-2 w-1/4 text-1xl ${loading && 'cursor-not-allowed'}` }  >{loading ? <AiOutlineLoading3Quarters className='animate-spin text-2xl text-center' /> : 'Submit'}</button>
                <Link to='/projects' className='p-2 bg-gray-300 text-black rounded-sm'>Cancel</Link>
                </div>
            </form>: <Loading/>}
        </div>
    );
}
