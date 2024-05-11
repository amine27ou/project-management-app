import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { axiosClient } from '../../api/axios';
import Loading from '../Loading';
import Pagination from '../Pagination';

export default function ShowProject() {
  const { id } = useParams();
  const [projectData, setProjectData] = useState({});
  const [projectTasks, setProjectTasks] = useState([]);

  const fetchProject = async (projectId) => {
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_BACKEND_URL}api/projects/${projectId}`);
      if (response.status === 200) {
        console.log(response)
        setProjectTasks(response.data.tasks);
        setProjectData(response.data.projects);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProject(id);
  }, [id]);

  

  return (
    <div className='bg-slate-900 min-h-screen'>
      <header className="bg-gray-800 shadow mb-4 rounded-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-row justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Project: '{projectData.name}'
          </h1>
        </div>
      </header>
      {Object.values(projectData).length > 0 ?
        <div className='bg-gray-800 shadow mb-4 rounded-sm flex items-start justify-between p-10'>
          <div className='w-full'>
            <img src={`http://127.0.0.1:8000/storage/${projectData.image_path}`} className='w-[300px]' alt="Project" />
            
          </div>
          <div>
            <h1 className='text-white'><strong>Project ID:</strong></h1>
            <p className='text-gray-500'>{projectData.id}</p>
            <h1 className='text-white'><strong>Project Name:</strong></h1>
            <p className='text-gray-500'>{projectData.name}</p>
            <h1 className='text-white'><strong>Project Description:</strong></h1>
            <p className='text-gray-500'>{projectData.description}</p>
            <h1 className='text-white'><strong>Project Status:</strong></h1>
            <p className='text-gray-500'>{projectData.status}</p>
            <h1 className='text-white'><strong>Created By:</strong></h1>
            <p className='text-gray-500'>{projectData.created_by}</p>
            <h1 className='text-white'><strong>Updated By:</strong></h1>
            <p className='text-gray-500'>{projectData.updated_by}</p>
            <h1 className='text-white'><strong>Create Date:</strong></h1>
            <p className='text-gray-500'>{projectData.created_at && projectData.created_at.split('T')[0]}</p>
            <h1 className='text-white'><strong>Project Due Date:</strong></h1>
            <p className='text-gray-500'>{projectData.due_date && projectData.due_date.split(' ')[0]}</p>
          </div>
        </div> : <Loading />}

      <div className='bg-gray-800 text-white '>
        <table className='w-full'>
          <thead className='bg-gray-700 w-full'>
            <tr>
              <td>ID</td>
              <td>Image</td>
              <td>Name</td>
              <td>Status</td>
              <td>Create Date</td>
              <td>Due Date</td>
              <td>Created By</td>
              <td className='text-center'>Actions</td>
            </tr>
          </thead>

          <tbody>
            {projectTasks?.length > 0 ? projectTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td><img src={`http://127.0.0.1:8000/storage/${task.image_path}`} className='w-10 h-10 object-cover border' alt={`Task ${task.id}`} /></td>
                <td><Link className='hover:underline cursor-pointer' to={`/tasks/${task.id}`}>{task.name}</Link></td>
                <td><p className={`p-2 text-center text-sm rounded-md ${task.status === 'completed' ? 'bg-green-500' : task.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'}`}>{task.status.toUpperCase() === 'IN_PROGRESS' ? 'IN PROGRESS' : task.status.toUpperCase()}</p></td>
                <td>{task.created_at}</td>
                <td>{task.due_date}</td>
                <td className='text-center'>{task.created_by}</td>
                <td className='text-center items-center justify-center flex gap-4 mt-2'>
                  <button onClick={() => { handleDelete(task.id) }} className='text-red-500'>Delete</button>
                  <Link to={`/projects/${task.id}/edit`} className='text-blue-500'>Update</Link>
                </td>
              </tr>
            )) : <Loading />}
          </tbody>
        </table>
      </div>
    </div>
  );
}
