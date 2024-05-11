import React, { useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import { axiosClient } from '../../api/axios';
import Loading from '../Loading';

export default function ShowTask() {
  const { id } = useParams();
  const [taskData, setTaskData] = useState({});
  const baseUrl = 'http://localhost:8000/api/tasks';

  const fetchProject = async (baseUrl, projectId) => {
    try {
      const response = await axiosClient.get(`${baseUrl}/${projectId}`);
      if (response.status === 200) {
        setTaskData(response.data.task);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProject(baseUrl, id);
  }, [id]);

 

  return (
    <div className='bg-slate-900 min-h-screen'>
      <header className="bg-gray-800 shadow mb-4 rounded-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-row justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Task: '{taskData.name}'
          </h1>
        </div>
      </header>
      {Object.keys(taskData).length > 0 ?
        <div className='bg-gray-800 shadow mb-4 rounded-sm flex items-start justify-between p-10'>
          <div className='w-full'>
            <img src={`http://127.0.0.1:8000/storage/${taskData.image_path}`} className='w-[300px]' alt="Project" />
          </div>
          <div>
            <h1 className='text-white'><strong>Task ID:</strong></h1>
            <p className='text-gray-500'>{taskData.id}</p>
            <h1 className='text-white'><strong>Task Name:</strong></h1>
            <p className='text-gray-500'>{taskData.name}</p>
            <h1 className='text-white'><strong>Task Description:</strong></h1>
            <p className='text-gray-500'>{taskData.description}</p>
            <h1 className='text-white'><strong>Task Status:</strong></h1>
            <p className='text-gray-500'>{taskData.status}</p>
            <h1 className='text-white'><strong>Created By:</strong></h1>
            <p className='text-gray-500'>{taskData.created_by}</p>
            <h1 className='text-white'><strong>Updated By:</strong></h1>
            <p className='text-gray-500'>{taskData.updated_by}</p>
            <h1 className='text-white'><strong>Create Date:</strong></h1>
            <p className='text-gray-500'>{taskData.created_at && taskData.created_at.split('T')[0]}</p>
            <h1 className='text-white'><strong>Task Due Date:</strong></h1>
            <p className='text-gray-500'>{taskData.due_date && taskData.due_date.split(' ')[0]}</p>
          </div>
        </div> : <Loading />}

      
    </div>
  );
}
